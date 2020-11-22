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
function sync(generatorFunctions) {
    return function* (args) {
        const callArgs = (args ? args : {});
        const { stateMap, count, initializedGenerators, } = initializeGenerators(generatorFunctions, callArgs);
        const generatorFunctionsIsArray = generatorFunctions instanceof Array;
        let result;
        let nextArg;
        let doneCount = 0;
        while (true) {
            result = (generatorFunctionsIsArray
                ? Array(generatorFunctions.length)
                : {});
            const lastResults = (generatorFunctionsIsArray ? [] : {});
            let nextFunc = () => void 0;
            if (typeof nextArg === 'function') {
                nextFunc = (lastResults, key) => nextArg(cpResult(lastResults), key);
            }
            else if (generatorFunctionsIsArray && nextArg instanceof Array || !generatorFunctionsIsArray && nextArg instanceof Object) {
                nextFunc = (lastResult, key) => nextArg[key];
            }
            for (let key in initializedGenerators) {
                const arg = nextFunc(lastResults, key);
                const gen = initializedGenerators[key];
                if (stateMap[key].done) {
                    result[key] = stateMap[key].returnedValue;
                    lastResults[key] = stateMap[key].returnedValue;
                    continue;
                }
                const nextVal = gen.next(arg);
                if (nextVal.done) {
                    doneCount++;
                    stateMap[key].done = true;
                    stateMap[key].returnedValue = nextVal;
                }
                result[key] = nextVal;
                lastResults[key] = nextVal;
            }
            if (doneCount === count) {
                return result;
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
exports.default = sync;
