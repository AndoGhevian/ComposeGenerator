"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
function sync(generatorFunctions) {
    return function* (args) {
        const callArgs = (args ? args : {});
        const { stateMap, count, initializedGenerators, } = utils_1.initializeGenerators(generatorFunctions, callArgs);
        const generatorFunctionsIsArray = generatorFunctions instanceof Array;
        let result;
        let nextArg;
        let doneCount = 0;
        while (true) {
            result = (generatorFunctionsIsArray
                ? Array(generatorFunctions.length)
                : {});
            const lastResults = (generatorFunctionsIsArray ? [] : {});
            let nextFunc = () => void (0);
            if (typeof nextArg === 'function') {
                nextFunc = (lastResults, key) => nextArg(utils_1.cpResult(lastResults), key);
            }
            else if (generatorFunctionsIsArray && nextArg instanceof Array || !generatorFunctionsIsArray && nextArg instanceof Object) {
                nextFunc = (lastResults, key) => nextArg[key];
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
            nextArg = yield utils_1.cpResult(result);
        }
    };
}
exports.default = sync;
