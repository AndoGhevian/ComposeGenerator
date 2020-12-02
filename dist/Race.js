"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
const race = function (generatorFunctions) {
    const compose = function* (args) {
        const callArgs = (args ? args : {});
        const { stateMap, count, initializedGenerators, } = utils_1.initializeGenerators(generatorFunctions, callArgs);
        let result = {};
        let alreadyDone = false;
        for (const key in initializedGenerators) {
            const nextVal = initializedGenerators[key].next();
            const resultVal = stateMap[key].isCompose ? nextVal.value : nextVal;
            result[key] = resultVal;
            alreadyDone = alreadyDone || !!nextVal.done;
        }
        if (alreadyDone) {
            return result;
        }
        let nextArg = yield utils_1.cpResult(result);
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
            for (const key in initializedGenerators) {
                const gen = initializedGenerators[key];
                const arg = nextFunc(lastResults, key);
                const nextVal = gen.next(arg);
                const resultVal = stateMap[key].isCompose ? nextVal.value : nextVal;
                if (nextVal.done) {
                    const resetedGen = utils_1.resetGenerator(key, generatorFunctions, callArgs);
                    initializedGenerators[key] = resetedGen;
                    const resetedNextVal = resetedGen.next();
                    result[key] = resetedNextVal;
                    lastResults[key] = resultVal;
                    continue;
                }
                result[key] = resultVal;
                lastResults[key] = resultVal;
            }
            nextArg = yield utils_1.cpResult(result);
        }
    };
    compose.composeType = 'race';
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
exports.default = race;
