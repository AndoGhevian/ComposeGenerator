export function cpResult(result: { [key: string]: IteratorResult<any, any> }): { [key: string]: IteratorResult<any, any> } {
    const currentResultCopy = (result instanceof Array
        ? Array(result.length)
        : {}) as { [key: string]: IteratorResult<any, any> }

    for (const key in result) {
        currentResultCopy[key] = { ...result[key] }
    }

    return currentResultCopy as any
}


export function initializeGenerators(
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

export function initializeSingleGenerator(
    key: string,
    generatorFunctions: { [key: string]: (...args: any[]) => Generator },
    callArgs: { [key: string]: any }
) {
    const args = callArgs[key]
    const genFunc = generatorFunctions[key]
    return args instanceof Array ? genFunc(...args) : genFunc()
}