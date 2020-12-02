export function cpResult(result: { [key: string]: IteratorResult<any, any> }): { [key: string]: IteratorResult<any, any> } {
    const currentResultCopy = (result instanceof Array
        ? Array(result.length)
        : {}) as { [key: string]: IteratorResult<any, any> }

    for (const key in result) {
        currentResultCopy[key] = { ...result[key] }
    }

    return currentResultCopy as any
}


export function isCompose(arg: any) {
    if (typeof arg === 'function' && arg.composeType) {
        return true
    }
    return false
}

export function initializeGenerators(
    generatorFunctions: { [key: string]: (...args: any[]) => Generator },
    callArgs: { [key: string]: any }
) {
    const initializedGenerators: { [key: string]: Generator } = {}

    let stateMap: {
        [key: string]: {
            done: boolean
            returnedValue?: any
            isCompose?: boolean
        }
    } = {} as any
    let count = 0

    for (const key in generatorFunctions) {
        const args = callArgs[key]
        const genFunc = generatorFunctions[key]

        stateMap[key] = { done: false }
        if (isCompose(genFunc)) {
            initializedGenerators[key] = genFunc(args instanceof Object ? args : {})
            stateMap[key].isCompose = true
        } else {
            initializedGenerators[key] = genFunc(...(args instanceof Array ? args : []))
        }
        count++
    }
    return {
        stateMap,
        count,
        initializedGenerators,
    }
}

export function resetGenerator(
    key: string,
    generatorFunctions: { [key: string]: (...args: any[]) => Generator },
    callArgs: { [key: string]: any }
) {
    const args = callArgs[key]
    const genFunc = generatorFunctions[key]
    if (isCompose(genFunc)) {
        return genFunc(args instanceof Object ? args : {})
    } else {
        return genFunc(...(args instanceof Array ? args : []))
    }
}