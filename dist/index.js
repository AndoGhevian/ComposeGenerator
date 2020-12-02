"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComposeType = exports.isCompose = exports.sync = exports.race = exports.embed = void 0;
var Embed_1 = require("./Embed");
Object.defineProperty(exports, "embed", { enumerable: true, get: function () { return __importDefault(Embed_1).default; } });
var Race_1 = require("./Race");
Object.defineProperty(exports, "race", { enumerable: true, get: function () { return __importDefault(Race_1).default; } });
var Sync_1 = require("./Sync");
Object.defineProperty(exports, "sync", { enumerable: true, get: function () { return __importDefault(Sync_1).default; } });
var utils_1 = require("./utils");
Object.defineProperty(exports, "isCompose", { enumerable: true, get: function () { return utils_1.isCompose; } });
var commonTypes_1 = require("./commonTypes");
Object.defineProperty(exports, "ComposeType", { enumerable: true, get: function () { return commonTypes_1.ComposeType; } });
const Sync_2 = __importDefault(require("./Sync"));
const Embed_2 = __importDefault(require("./Embed"));
const util_1 = require("util");
const compose = Embed_2.default({
    outer: function* () {
        yield 1;
        yield 2;
        yield 3;
        yield 4;
    },
    inner: Sync_2.default({
        fir: function* () {
            yield 1;
            yield 2;
            yield 3;
            yield 4;
            return 5;
        },
        sec: function* () {
            yield 'Welcome Andy 1';
            yield 'welcome Andy 2';
            return 'welcome Andy 3';
        },
        third: function* (welcome) {
            yield `Welcome ${welcome ? welcome : 'default'} 1`;
            yield `Welcome ${welcome ? welcome : 'default'} 2`;
            return `Welcome ${welcome ? welcome : 'default'} 3`;
        }
    }),
});
const calledCompose = compose({
    inner: {
        third: ['Alonia'],
    }
});
log(calledCompose.next());
log(calledCompose.next());
log(calledCompose.next());
log(calledCompose.next());
log(calledCompose.next());
function log(obj) {
    console.log(util_1.inspect(obj, false, Infinity));
}
// console.log(
//     calledCompose.next()
// )
// console.log(
//     calledCompose.next()
// )
// console.log(
//     calledCompose.next()
// )
// console.log(
//     calledCompose.next()
// )
