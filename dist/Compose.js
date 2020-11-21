"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sync = void 0;
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
        let doneCount = 0;
        let nextArg = undefined;
        while (true) {
            const result = generatorFunctions instanceof Array
                ? Array(generatorFunctions.length)
                : {};
            for (let key in initializedGenerators) {
                if (stateMap[key].done) {
                    result[key] = stateMap[key].returnedValue;
                    continue;
                }
                const gen = initializedGenerators[key];
                const nextVal = gen.next(nextArg);
                if (nextVal.done) {
                    doneCount++;
                    stateMap[key].done = true;
                    stateMap[key].returnedValue = nextVal;
                    result[key] = nextVal;
                }
                else {
                    result[key] = nextVal;
                }
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
exports.sync = sync;
// const gen = sync({
//     a: function*(start?: number) {
//         if(start !== undefined) {
//             yield start
//         }
//         yield 1
//         yield 2
//         yield 3
//         return 4
//     },
//     b: function*() {
//         yield 'as'
//         // yield 'bas'
//         return 'tas'
//     }
// })({a: [1]})
// console.log(
//     gen.next(),
//     gen.next(),
//     gen.next(),
//     gen.next(),
//     gen.next(),
//     gen.next(),
//     gen.next(),
//     gen.next(),
// )
// // for(let val of gen) {
//     // console.log(val)
// // }
