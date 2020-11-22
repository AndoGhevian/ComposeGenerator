"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
function race(generatorFunctions) {
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
            for (const key in initializedGenerators) {
                const arg = nextFunc(lastResults, key);
                const gen = initializedGenerators[key];
                const nextVal = gen.next(arg);
                if (nextVal.done) {
                    const resetedGen = utils_1.initializeSingleGenerator(key, generatorFunctions, callArgs);
                    initializedGenerators[key] = resetedGen;
                    const resetedNextVal = resetedGen.next();
                    result[key] = resetedNextVal;
                    lastResults[key] = resetedNextVal;
                    continue;
                }
                result[key] = nextVal;
                lastResults[key] = nextVal;
            }
            nextArg = yield utils_1.cpResult(result);
        }
    };
}
exports.default = race;
