import {
    Compose,
    Composer,
} from "./commonTypes";
import {
    cpResult,
    initializeGenerators,
    resetGenerator,
} from "./utils";


const embed: Composer<'embed'> = function (generatorFunctions) {
    const compose: Compose<'embed'> = function* (args: any) {
        const callArgs: any = (args ? args : {})
        const {
            stateMap,
            count,
            initializedGenerators,
        } = initializeGenerators(
            generatorFunctions as { [key: string]: (...args: any[]) => Generator },
            callArgs
        )

        let result: any = {}
        let alreadyDone = false
        for (const key in initializedGenerators) {
            const nextVal = initializedGenerators[key].next()
            const resultVal = stateMap[key].isCompose ? nextVal.value : nextVal
            result[key] = resultVal
            alreadyDone = alreadyDone || !!nextVal.done
        }
        if (alreadyDone) {
            return result as any
        }

        let nextArg = yield cpResult(result) as any
        while (true) {
            const lastResults: any = {}

            let nextFunc: (lastResults: any, key: any) => any
            nextFunc = () => void (0)
            if (typeof nextArg === 'function') {
                let lastNextArgs: any = {}
                nextFunc = (lastResults: any, key: string) => {
                    const arg = nextArg!(cpResult(lastResults) as any, key, lastNextArgs, compose)
                    if(arg instanceof Object) {
                        lastNextArgs = arg
                    }
                    return lastNextArgs[key]
                }
            } else if(nextArg instanceof Object) {
                nextFunc = (lastResults, key) => nextArg[key]
            }

            let doneCount = 0
            for (const key in initializedGenerators) {
                const gen = initializedGenerators[key]
                const arg = nextFunc(lastResults, key)

                const nextVal = gen.next(arg)
                const resultVal = stateMap[key].isCompose ? nextVal.value : nextVal
                if (!nextVal.done) {
                    result[key] = resultVal
                    break
                }

                doneCount++
                lastResults[key] = resultVal
                const resetedGen = resetGenerator(
                    key,
                    generatorFunctions as { [key: string]: (...args: any[]) => Generator },
                    callArgs
                )
                initializedGenerators[key] = resetedGen
                result[key] = resetedGen.next()
            }
            if (doneCount === count) {
                return lastResults as any
            }

            nextArg = yield cpResult(result) as any
        }
    } as any
    compose.composeType = 'embed'
    Object.defineProperty(compose, 'emptyNextArgs', {
        get() {
            return {}
        }
    })
    Object.defineProperty(compose, 'emptyCallArgs', {
        get() {
            return {}
        }
    })
    return compose
}


export default embed