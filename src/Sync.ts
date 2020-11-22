type CallArgs<T extends ((...args: any[]) => Generator)[] | {
    [key: string]: ((...args: any[]) => Generator)
}> = T extends any[]
    ? (any[] | undefined)[]
    : { [P in keyof T]?: any[] };

type ComposeResult<T extends ((...args: any[]) => Generator)[] | {
    [key: string]: ((...args: any[]) => Generator)
}> = T extends any[]
    ? IteratorResult<any, any>[]
    : { [P in keyof T]: IteratorResult<any, any> }

type ComposeNext<T extends ((...args: any[]) => Generator)[] | {
    [key: string]: ((...args: any[]) => Generator)
}> = T extends any[]
    ? ((
        lastResults: IteratorResult<any, any>[],
        key: string
    ) => any) | (any[] | undefined)
    : ((
        lastResults: { [P in keyof T]: IteratorResult<any, any> | undefined },
        key: string
    ) => any) | ({ [P in keyof T]?: IteratorResult<any, any> } | undefined)

function initializeGenerators(
    generatorFunctions: { [key: string]: (...args: any[]) => Generator },
    callArgs: { [key: string]: any }
) {
    const initializedGenerators: { [key: string]: Generator } = {}

    let stateMap: {
        [key: string]: {
            done: boolean,
            returnedValue?: any
        }
    } = {} as any
    let count = 0

    for (const key in generatorFunctions) {
        const args = callArgs[key]
        const genFunc = generatorFunctions[key]
        if (args instanceof Array) {
            initializedGenerators[key] = genFunc(...args)
        } else {
            initializedGenerators[key] = genFunc()
        }

        stateMap[key] = { done: false }
        count++
    }
    return {
        stateMap,
        count,
        initializedGenerators,
    }
}

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

            let nextFunc: (lastResults: any, key: any) => any = () => void 0;
            if (typeof nextArg === 'function') {
                nextFunc = (lastResults, key) => nextArg(cpResult(lastResults), key)
            } else if (generatorFunctionsIsArray && nextArg instanceof Array || !generatorFunctionsIsArray && nextArg instanceof Object) {
                nextFunc = (lastResult, key) => nextArg[key]
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
        function cpResult(result: { [key: string]: IteratorResult<any, any> }): { [key: string]: IteratorResult<any, any> } {
            const currentResultCopy = (result instanceof Array
                ? Array(result.length)
                : {}) as { [key: string]: IteratorResult<any, any> }

            for (const key in result) {
                currentResultCopy[key] = { ...result[key] }
            }

            return currentResultCopy as any
        }
    }
}