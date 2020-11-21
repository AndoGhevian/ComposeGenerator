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
        let doneCount = 0;
        let nextArg = undefined;
        while (true) {
            const result = (generatorFunctionsIsArray
                ? Array(generatorFunctions.length)
                : {});
            const lastResults = (generatorFunctionsIsArray ? [] : {});
            let gen;
            let getNextVal;
            getNextVal = () => gen.next();
            if (typeof nextArg === 'function') {
                getNextVal = (lastResults, key) => gen.next(nextArg(lastResults, key));
            }
            else if (generatorFunctionsIsArray && nextArg instanceof Array || !generatorFunctionsIsArray && nextArg instanceof Object) {
                getNextVal = (lastResult, key) => gen.next(nextArg[key]);
            }
            for (let key in initializedGenerators) {
                if (stateMap[key].done) {
                    getNextVal(lastResults, key);
                    result[key] = Object.assign({}, stateMap[key].returnedValue);
                    lastResults[key] = Object.assign({}, stateMap[key].returnedValue);
                    continue;
                }
                gen = initializedGenerators[key];
                const nextVal = getNextVal(lastResults, key);
                if (nextVal.done) {
                    doneCount++;
                    stateMap[key].done = true;
                    stateMap[key].returnedValue = nextVal;
                }
                result[key] = Object.assign({}, nextVal);
                lastResults[key] = Object.assign({}, nextVal);
            }
            if (doneCount !== count) {
                nextArg = yield result;
            }
            else {
                return result;
            }
        }
    };
}
exports.default = sync;
