import {
    Compose,
    Composer,
} from "./commonTypes";
import {
    cpResult,
    initializeGenerators,
} from "./utils";


const sync: Composer<'sync'> = function (generatorFunctions) {
    const compose: Compose<'sync'> = function* (args: any) {
        const callArgs: any = (args ? args : {})
        const {
            stateMap,
            count,
            initializedGenerators,
        } = initializeGenerators(
            generatorFunctions as { [key: string]: (...args: any[]) => Generator },
            callArgs
        )

        let result: any, nextArg: any
        let doneCount = 0

        while (true) {
            const lastResults: any = {}
            result = {}

            let nextFunc: (lastResults: any, key: any) => any
            nextFunc = () => void (0)
            if (typeof nextArg === 'function') {
                let lastNextArgs: any = {}
                nextFunc = (lastResults, key) => {
                    const arg = nextArg(cpResult(lastResults), key, lastNextArgs, compose)
                    if (arg instanceof Object) {
                        lastNextArgs = arg
                    }
                    return lastNextArgs[key]
                }
            } else if (nextArg instanceof Object) {
                nextFunc = (lastResults, key) => nextArg[key]
            }

            for (let key in initializedGenerators) {
                const gen = initializedGenerators[key]
                const arg = nextFunc(lastResults, key)

                if (stateMap[key].done) {
                    result[key] = stateMap[key].returnedValue
                    lastResults[key] = stateMap[key].returnedValue
                    continue
                }


                const nextVal = gen.next(arg)
                const resultVal = stateMap[key].isCompose ? nextVal.value : nextVal
                if (nextVal.done) {
                    doneCount++
                    stateMap[key].done = true
                    stateMap[key].returnedValue = resultVal
                }
                result[key] = resultVal
                lastResults[key] = resultVal
            }

            if (doneCount === count) {
                return result as any
            }
            nextArg = yield cpResult(result) as any
        }
    } as any
    compose.composeType = 'sync'
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


export default sync