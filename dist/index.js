"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.embed = exports.sync = void 0;
var Sync_1 = require("./Sync");
Object.defineProperty(exports, "sync", { enumerable: true, get: function () { return __importDefault(Sync_1).default; } });
var Embed_1 = require("./Embed");
Object.defineProperty(exports, "embed", { enumerable: true, get: function () { return __importDefault(Embed_1).default; } });
const Embed_2 = __importDefault(require("./Embed"));
function* genFunc1() {
    let x = yield 1;
    console.log(`x1: ${x}`);
    x = yield 2;
    console.log(`x2: ${x}`);
    x = yield 3;
    console.log(`x3: ${x}`);
    x = yield 4;
    console.log(`x4: ${x}`);
    x = yield 5;
    console.log(`x5: ${x}`);
    return 'genFunc1';
}
function* genFunc2(start) {
    if (start !== undefined) {
        yield start;
    }
    let y = yield 1;
    console.log(`y1: ${y}`);
    y = yield 'Hello';
    console.log(`y2: ${y}`);
    return 'genFunc2';
}
const array = [100, 1000, 10000];
function* genFuncArray() {
    for (const val of array) {
        yield val;
    }
    return 'genFuncArray';
}
function* emptyGenFunc() {
    return 'ssssssss';
}
const gen = Embed_2.default({
    c: genFunc2,
    d: genFunc2,
})();
console.log(gen.next((lastResults, key) => {
    // console.log('lastResults')
    // console.log(lastResults)
    // return 1
}));
console.log(gen.next((lastResults, key) => {
    // console.log('lastResults')
    // console.log(lastResults)
    // console.log('key')
    // console.log(key)
    return 'blue';
}));
console.log(gen.next((lastResults, key) => {
    // console.log('lastResults')
    // console.log(lastResults)
    // console.log('key')
    // console.log(key)
    return 'blue';
}));
console.log(gen.next((lastResults, key) => {
    // console.log('lastResults')
    // console.log(lastResults)
    // console.log('key')
    // console.log(key)
    return 'blue';
}));
console.log(gen.next((lastResults, key) => {
    console.log('lastResults');
    console.log(lastResults);
    console.log('key');
    console.log(key);
    return 'yelloowwwwwwww';
}));
// console.log(
//     gen.next(['xxx', 'yyy']),
// )
// console.log(
//     gen.next((a, key) => {
//         console.log('asssssssssssssssssssssss111111111')
//         console.log(key)
//         console.log(a)
//         console.log('asssssssssssssssssssssss2222222222')
//         return key
//     }),
// )
// console.log(
//     gen.next(1 as any),
// )
// console.log(
//     gen.next(),
//     'asdasdsasssssssssssssssss'
// )
// const gen = sequance({
//     genFunc1,
//     genFunc2,
//     genFuncArray,
// })({
//     genFunc1: [],
//     genFunc2: ['start value']
// })
// for (const currStep of gen) {
//     const gen1Value = currStep.step?.next().value
//     const gen2Value = currStep.step?.next(gen1Value?.newState?.value).value
//     const gen3Value = currStep.step?.next(gen2Value?.newState?.value).value
//     console.log({
//         genFunc1: 
//     })
// }
// const step1State = gen.next()
// if (!step1State.done) {
//     const step1 = step1State.value.step
//     step1!.next(1)
//     step1!.next('sadasdsa')
//     step1!.next('sadassadsadsad')
//     step1?.next().done === true
//     step1?.next().value.
// }
// const compose = sync([genFunc1, genFunc2, genFuncArray])([
//     undefined,
//     ['start value'],
// ])
// compose.next((
//     lastResults: IteratorResult<any, any>[],
//     key: string
// ) => {
//     return 'sdabcgjak'
// })
// for(const name of names) {
//     for(const lastname of lastNames) {
//         console.log(name + lastname)
//     }
// }
// const genNames = names()
// const genLastNames = lastNames()
// genNames.next()
// genLastNames.next()
// function* f() {
//     for (const state of compose) {
//         console.log(state)
//     }
// }
// genFunc1()
// genFunc2(...['start value'])
// genFuncArray()
