"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function initializeGenerators(generatorFunctions, callArgs) {
    const initializedGenerators = {};
    let stateMap = {};
    let count = 0;
    for (const key in generatorFunctions) {
        const args = callArgs[key];
        const genFunc = generatorFunctions[key];
        if (args instanceof Array) {
            initializedGenerators[key] = genFunc(...args);
        }
        else {
            initializedGenerators[key] = genFunc();
        }
        stateMap[key] = { done: false };
        count++;
    }
    return {
        stateMap,
        count,
        initializedGenerators,
    };
}
function initializeSingleGenerator(key, generatorFunctions, callArgs) {
    const args = callArgs[key];
    const genFunc = generatorFunctions[key];
    return args instanceof Array ? genFunc(...args) : genFunc();
}
function embed(generatorFunctions) {
    return function* (args) {
        const callArgs = (args ? args : {});
        const { stateMap, count, initializedGenerators, } = initializeGenerators(generatorFunctions, callArgs);
        const generatorFunctionsIsArray = generatorFunctions instanceof Array;
        let result = (generatorFunctionsIsArray
            ? Array(generatorFunctions.length)
            : {});
        let alreadyDone = false;
        for (const key in initializedGenerators) {
            const nextVal = initializedGenerators[key].next();
            result[key] = nextVal;
            alreadyDone = alreadyDone || !!nextVal.done;
        }
        if (alreadyDone) {
            return result;
        }
        let nextArg = yield cpResult(result);
        while (true) {
            let nextFunc = (lastResults, key) => nextArg;
            if (typeof nextArg === 'function') {
                nextFunc = (lastResults, key) => nextArg(cpResult(lastResults), key);
            }
            const lastResults = (generatorFunctionsIsArray ? [] : {});
            let doneCount = 0;
            for (const key in initializedGenerators) {
                const arg = nextFunc(lastResults, key);
                const genFunc = initializedGenerators[key];
                const nextVal = genFunc.next(arg);
                if (!nextVal.done) {
                    result[key] = nextVal;
                    break;
                }
                doneCount++;
                lastResults[key] = nextVal;
                const resetedGen = initializeSingleGenerator(key, generatorFunctions, callArgs);
                initializedGenerators[key] = resetedGen;
                result[key] = resetedGen.next();
            }
            if (doneCount === count) {
                return lastResults;
            }
            nextArg = yield cpResult(result);
        }
        function cpResult(result) {
            const currentResultCopy = (result instanceof Array
                ? Array(result.length)
                : {});
            for (const key in result) {
                currentResultCopy[key] = Object.assign({}, result[key]);
            }
            return currentResultCopy;
        }
    };
}
exports.default = embed;
