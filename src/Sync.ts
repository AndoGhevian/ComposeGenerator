import { CallArgs, ComposeNext, ComposeResult } from "./commonTypes";
import {
    cpResult,
    initializeGenerators,
} from "./utils";


export default function sync<T extends ((...args: any[]) => Generator)[] | {
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


        let result: { [key: string]: IteratorResult<any, any> }
        let nextArg: any

        let doneCount = 0
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

            for (let key in initializedGenerators) {
                const arg = nextFunc(lastResults, key)
                const gen = initializedGenerators[key]

                if (stateMap[key].done) {
                    result[key] = stateMap[key].returnedValue
                    lastResults[key] = stateMap[key].returnedValue
                    continue
                }


                const nextVal = gen.next(arg)
                if (nextVal.done) {
                    doneCount++
                    stateMap[key].done = true
                    stateMap[key].returnedValue = nextVal
                }
                result[key] = nextVal
                lastResults[key] = nextVal
            }

            if (doneCount === count) {
                return result as any
            }
            nextArg = yield cpResult(result) as any
        }
    }
}