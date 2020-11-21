"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequance = exports.sync = void 0;
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
            const result = (generatorFunctions instanceof Array
                ? Array(generatorFunctions.length)
                : {});
            for (let key in initializedGenerators) {
                if (stateMap[key].done) {
                    result[key] = Object.assign({}, stateMap[key].returnedValue);
                    continue;
                }
                const gen = initializedGenerators[key];
                const nextVal = gen.next(nextArg);
                if (nextVal.done) {
                    doneCount++;
                    stateMap[key].done = true;
                    stateMap[key].returnedValue = nextVal;
                    result[key] = Object.assign({}, nextVal);
                }
                else {
                    result[key] = Object.assign({}, nextVal);
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
function sequance(generatorFunctions) {
    return function* (args) {
        const callArgs = (args ? args : {});
        const { count, initializedGenerators, } = initializeGenerators(generatorFunctions, callArgs);
        let doneCount = 0;
        const currentState = (generatorFunctions instanceof Array
            ? Array(generatorFunctions.length)
            : {});
        for (const key in initializedGenerators) {
            const gen = initializedGenerators[key];
            const initialState = gen.next();
            currentState[key] = initialState;
            if (initialState.done) {
                doneCount++;
            }
        }
        while (true) {
            if (doneCount !== count) {
                const gen = stepsGenerator();
                gen.next();
                const step = {
                    step: gen,
                    state: cpCurrentState(),
                    complete: false,
                };
                yield step;
                gen.return(undefined);
            }
            else {
                const gen = stepsGenerator();
                gen.next();
                const step = {
                    // step: gen,
                    state: cpCurrentState(),
                    complete: true,
                };
                return step;
            }
        }
        function* stepsGenerator() {
            let nextArg = yield {};
            for (const key in currentState) {
                if (!currentState[key].done) {
                    const gen = initializedGenerators[key];
                    const newState = gen.next(nextArg);
                    currentState[key] = newState;
                    if (newState.done) {
                        doneCount++;
                    }
                }
                const stepYield = {
                    key,
                    newState: Object.assign({}, currentState[key]),
                    state: cpCurrentState(),
                    complete: doneCount === count,
                };
                nextArg = yield stepYield;
            }
            const stepYield = {
                state: cpCurrentState(),
                complete: doneCount === count,
            };
            return stepYield;
        }
        function cpCurrentState() {
            const currentStateCopy = (generatorFunctions instanceof Array
                ? Array(generatorFunctions.length)
                : {});
            for (const key in currentState) {
                currentStateCopy[key] = Object.assign({}, currentState[key]);
            }
            return currentStateCopy;
        }
    };
}
exports.sequance = sequance;
// const gen = sequance({
//     a: function* (start?: number) {
//         if (start !== undefined) {
//             yield start
//         }
//         yield 1
//         yield 2
//         yield 3
//         return 4
//     },
//     b: function* () {
//         yield 'as'
//         // yield 'bas'
//         return 'tas'
//     }
// })({ a: [1] })
// const step1 = gen.next().value.step
// if (step1) {
//     const nextState = step1.next()
//     nextState.value.newState
//     if (nextState.done) {
//         nextState.value.key
//     } else {
//         nextState.value.state.a
//     }
// }
// console.log(step1)
// console.log(
//     step1.next('as' as any),
//     step1.next(2),
// );
// const step2 = gen.next().value;
// console.log(step2)
// const res = step1.next()
// if (res.done) {
//     res.value
// }
// step1.next()
// step1.next()
// step1.next()
// step1.next()
// console.log(
//     step2.next('as' as any),
//     step2.next(2),
//     step2.next(2),
//     step2.next(2),
// )
// console.log(gen.next().value.next())
// console.log(gen.next().value.next())
// const step3 = gen.next()
// console.log(
//     'step3.value.next(),',
//     step3.value.next(),
//     step3.value.next(),
//     step3.value.next(),
//     step3.value.next(),
// )
// const step4 = gen.next()
// console.log(
//     'step4.value.next(),',
//     step4.value.next(),
//     step4.value.next(),
//     step4.value.next(),
//     step4.value.next(),
// )
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
// const f = function* (start?: number) {
//     if (start !== undefined) {
//         yield start
//     }
//     yield 1
//     yield 2
//     yield 3
//     return 'asda'
// }
// f().return()
