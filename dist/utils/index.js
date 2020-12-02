"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetGenerator = exports.initializeGenerators = exports.isCompose = exports.cpResult = void 0;
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
function isCompose(arg) {
    if (typeof arg === 'function' && arg.composeType) {
        return true;
    }
    return false;
}
exports.isCompose = isCompose;
function initializeGenerators(generatorFunctions, callArgs) {
    const initializedGenerators = {};
    let stateMap = {};
    let count = 0;
    for (const key in generatorFunctions) {
        const args = callArgs[key];
        const genFunc = generatorFunctions[key];
        stateMap[key] = { done: false };
        if (isCompose(genFunc)) {
            initializedGenerators[key] = genFunc(args instanceof Object ? args : {});
            stateMap[key].isCompose = true;
        }
        else {
            initializedGenerators[key] = genFunc(...(args instanceof Array ? args : []));
        }
        count++;
    }
    return {
        stateMap,
        count,
        initializedGenerators,
    };
}
exports.initializeGenerators = initializeGenerators;
function resetGenerator(key, generatorFunctions, callArgs) {
    const args = callArgs[key];
    const genFunc = generatorFunctions[key];
    if (isCompose(genFunc)) {
        return genFunc(args instanceof Object ? args : {});
    }
    else {
        return genFunc(...(args instanceof Array ? args : []));
    }
}
exports.resetGenerator = resetGenerator;
