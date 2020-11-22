import { CallArgs, ComposeNext, ComposeResult } from "./commonTypes";
import {
    cpResult,
    initializeGenerators,
    initializeSingleGenerator,
} from "./utils";


export default function race<T extends ((...args: any[]) => Generator)[] | {
    [key: string]: ((...args: any[]) => Generator)
}>(generatorFunctions: T) {
    return function* (args?: CallArgs<T>): Generator<ComposeResult<T>, ComposeResult<T>, ComposeNext<T>> {
        const callArgs = (args ? args : {}) as { [key: string]: any }
        const {
            stateMap,
            count,
            initializedGenerators,
        } = initializeGenerators(
            generatorFunctions as { [key: string]: (...args: any[]) => Generator },
            callArgs
        )
        const generatorFunctionsIsArray = generatorFunctions instanceof Array


        let result = (generatorFunctionsIsArray
            ? Array(generatorFunctions.length)
            : {}) as { [key: string]: IteratorResult<any, any> }

        let alreadyDone = false
        for (const key in initializedGenerators) {
            const nextVal = initializedGenerators[key].next()
            result[key] = nextVal
            alreadyDone = alreadyDone || !!nextVal.done
        }
        if (alreadyDone) {
            return result as any
        }


        let nextArg: any = yield cpResult(result) as any
        while (true) {
            result = (generatorFunctionsIsArray
                ? Array(generatorFunctions.length)
                : {}) as { [key: string]: IteratorResult<any, any> }

            const lastResults = (generatorFunctionsIsArray ? [] : {}) as { [key: string]: IteratorResult<any, any> }

            let nextFunc: (lastResults: any, key: any) => any = () => void (0)
            if (typeof nextArg === 'function') {
                nextFunc = (lastResults, key) => nextArg(cpResult(lastResults), key)
            } else if (generatorFunctionsIsArray && nextArg instanceof Array || !generatorFunctionsIsArray && nextArg instanceof Object) {
                nextFunc = (lastResults, key) => nextArg[key]
            }

            for (const key in initializedGenerators) {
                const arg = nextFunc(lastResults, key)
                const gen = initializedGenerators[key]

                const nextVal = gen.next(arg)
                if (nextVal.done) {
                    const resetedGen = initializeSingleGenerator(
                        key,
                        generatorFunctions as { [key: string]: (...args: any[]) => Generator },
                        callArgs
                    )
                    initializedGenerators[key] = resetedGen

                    const resetedNextVal = resetedGen.next()
                    result[key] = resetedNextVal
                    lastResults[key] = resetedNextVal
                    continue
                }
                result[key] = nextVal
                lastResults[key] = nextVal
            }

            nextArg = yield cpResult(result) as any
        }
    }
}