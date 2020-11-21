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


        let doneCount = 0
        let nextArg: any = undefined
        while (true) {
            const result = (generatorFunctionsIsArray
                ? Array(generatorFunctions.length)
                : {}) as { [key: string]: IteratorResult<any, any> }

            const lastResults = (generatorFunctionsIsArray ? [] : {}) as { [key: string]: IteratorResult<any, any> }

            let gen: Generator
            let getNextVal: (lastResults: any, key: any) => IteratorResult<any, any>

            getNextVal = () => gen.next()
            if (typeof nextArg === 'function') {
                getNextVal = (lastResults, key) => gen.next(nextArg(lastResults, key))
            } else if (generatorFunctionsIsArray && nextArg instanceof Array || !generatorFunctionsIsArray && nextArg instanceof Object) {
                getNextVal = (lastResult: any, key: any) => gen.next(nextArg[key])
            }

            for (let key in initializedGenerators) {
                if (stateMap[key].done) {
                    getNextVal(lastResults, key)
                    result[key] = { ...stateMap[key].returnedValue }
                    lastResults[key] = { ...stateMap[key].returnedValue }
                    continue
                }

                gen = initializedGenerators[key]
                const nextVal = getNextVal(lastResults, key)
                if (nextVal.done) {
                    doneCount++
                    stateMap[key].done = true
                    stateMap[key].returnedValue = nextVal
                }
                result[key] = { ...nextVal }
                lastResults[key] = { ...nextVal }
            }

            if (doneCount !== count) {
                nextArg = yield result as any
            } else {
                return result as any
            }
        }
    }
}




export function embed<T extends ((...args: any[]) => Generator)[] | {
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

        
        return 1 as any
    }
}