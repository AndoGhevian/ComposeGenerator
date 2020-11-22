"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeSingleGenerator = exports.initializeGenerators = exports.cpResult = void 0;
function cpResult(result) {
    const currentResultCopy = (result instanceof Array
        ? Array(result.length)
        : {});
    for (const key in result) {
        currentResultCopy[key] = Object.assign({}, result[key]);
    }
    return currentResultCopy;
}
exports.cpResult = cpResult;
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
exports.initializeGenerators = initializeGenerators;
function initializeSingleGenerator(key, generatorFunctions, callArgs) {
    const args = callArgs[key];
    const genFunc = generatorFunctions[key];
    return args instanceof Array ? genFunc(...args) : genFunc();
}
exports.initializeSingleGenerator = initializeSingleGenerator;
