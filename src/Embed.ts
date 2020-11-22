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

interface CustomGenerator<T extends ((...args: any[]) => Generator)[] | {
    [key: string]: ((...args: any[]) => Generator)
}> extends Generator<ComposeResult<T>, ComposeResult<T>> {
    next<B>(arg0?: B extends Function ? ((
        lastResults: T extends any[] ? IteratorResult<any, any>[] : { [P in keyof T]?: IteratorResult<any, any> },
        key: string
    ) => any) : any): IteratorResult<ComposeResult<T>, ComposeResult<T>>;
    [Symbol.iterator](): CustomGenerator<T>
}

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

function initializeSingleGenerator(
    key: string,
    generatorFunctions: { [key: string]: (...args: any[]) => Generator },
    callArgs: { [key: string]: any }
) {
    const args = callArgs[key]
    const genFunc = generatorFunctions[key]
    return args instanceof Array ? genFunc(...args) : genFunc()
}


export default function embed<T extends ((...args: any[]) => Generator)[] | {
    [key: string]: ((...args: any[]) => Generator)
}>(generatorFunctions: T) {
    return function* (args?: CallArgs<T>): CustomGenerator<T> {
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

        let nextArg = yield cpResult(result) as any
        while (true) {
            let nextFunc = (lastResults: any, key: string) => nextArg
            if (typeof nextArg === 'function') {
                nextFunc = (lastResults: any, key: string) => nextArg!(cpResult(lastResults) as any, key)
            }

            const lastResults = (generatorFunctionsIsArray ? [] : {}) as { [key: string]: IteratorResult<any, any> }

            let doneCount = 0
            for (const key in initializedGenerators) {

                const arg = nextFunc(lastResults, key)
                const genFunc = initializedGenerators[key]

                const nextVal = genFunc.next(arg)
                if (!nextVal.done) {
                    result[key] = nextVal
                    break
                }

                doneCount++
                lastResults[key] = nextVal
                const resetedGen = initializeSingleGenerator(
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