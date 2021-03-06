"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
function embed(generatorFunctions) {
    return function* (args) {
        const callArgs = (args ? args : {});
        const { stateMap, count, initializedGenerators, } = utils_1.initializeGenerators(generatorFunctions, callArgs);
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
        let nextArg = yield utils_1.cpResult(result);
        while (true) {
            let nextFunc = (lastResults, key) => nextArg;
            if (typeof nextArg === 'function') {
                nextFunc = (lastResults, key) => nextArg(utils_1.cpResult(lastResults), key);
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
                const resetedGen = utils_1.initializeSingleGenerator(key, generatorFunctions, callArgs);
                initializedGenerators[key] = resetedGen;
                result[key] = resetedGen.next();
            }
            if (doneCount === count) {
                return lastResults;
            }
            nextArg = yield utils_1.cpResult(result);
        }
    };
}
exports.default = embed;
