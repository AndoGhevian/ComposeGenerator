"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
const sync = function (generatorFunctions) {
    const compose = function* (args) {
        const callArgs = (args ? args : {});
        const { stateMap, count, initializedGenerators, } = utils_1.initializeGenerators(generatorFunctions, callArgs);
        let result, nextArg;
        let doneCount = 0;
        while (true) {
            const lastResults = {};
            result = {};
            let nextFunc;
            nextFunc = () => void (0);
            if (typeof nextArg === 'function') {
                let lastNextArgs = {};
                nextFunc = (lastResults, key) => {
                    const arg = nextArg(utils_1.cpResult(lastResults), key, lastNextArgs, compose);
                    if (arg instanceof Object) {
                        lastNextArgs = arg;
                    }
                    return lastNextArgs[key];
                };
            }
            else if (nextArg instanceof Object) {
                nextFunc = (lastResults, key) => nextArg[key];
            }
            for (let key in initializedGenerators) {
                const gen = initializedGenerators[key];
                const arg = nextFunc(lastResults, key);
                if (stateMap[key].done) {
                    result[key] = stateMap[key].returnedValue;
                    lastResults[key] = stateMap[key].returnedValue;
                    continue;
                }
                const nextVal = gen.next(arg);
                const resultVal = stateMap[key].isCompose ? nextVal.value : nextVal;
                if (nextVal.done) {
                    doneCount++;
                    stateMap[key].done = true;
                    stateMap[key].returnedValue = resultVal;
                }
                result[key] = resultVal;
                lastResults[key] = resultVal;
            }
            if (doneCount === count) {
                return result;
            }
            nextArg = yield utils_1.cpResult(result);
        }
    };
    compose.composeType = 'sync';
    Object.defineProperty(compose, 'emptyNextArgs', {
        get() {
            return {};
        }
    });
    Object.defineProperty(compose, 'emptyCallArgs', {
        get() {
            return {};
        }
    });
    return compose;
};
exports.default = sync;
