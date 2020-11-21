"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLevelChecker = exports.isGenerator = exports.isIterable = exports.isIterator = void 0;
exports.isIterator = (obj) => {
    if (obj != null && typeof obj.next === 'function') {
        return true;
    }
    return false;
};
exports.isIterable = (obj) => {
    if (obj != null && typeof obj[Symbol.iterator] === 'function') {
        return true;
    }
    return false;
};
exports.isGenerator = (val) => {
    if (val != null && val.constructor.name === 'GeneratorFunction') {
        return true;
    }
    return false;
};
exports.createLevelChecker = (levelInfo) => {
    /**
     * Describe level Info in numbers.
     */
    const levelInfoNumbers = {
        iterables: 0,
        iterators: 0,
    };
    if (levelInfo.usePriority === 'iterables')
        levelInfoNumbers.iterables = 1;
    if (!levelInfo.useIterables)
        levelInfoNumbers.iterables = -1;
    levelInfoNumbers.iterators = levelInfoNumbers.iterables < 1 ? 1 : 0;
    if (!levelInfo.useIterators)
        levelInfoNumbers.iterators = -1;
    /**
     * Returns how to work with provided value:
     * - Work as with simple value.
     * - Work as with iterable.
     * - Work as with iterator.
     * @param gen any value.
     */
    let genLevelChecker;
    if (levelInfoNumbers.iterables === 0 && levelInfoNumbers.iterators === 1) {
        genLevelChecker = (gen) => exports.isIterator(gen) ? 'asIterator' : exports.isIterable(gen) ? 'asIterable' : 'asSimpleValue';
    }
    else if (levelInfoNumbers.iterables === 0) {
        genLevelChecker = (gen) => exports.isIterable(gen) ? 'asIterable' : 'asSimpleValue';
    }
    else if (levelInfoNumbers.iterables === 1) {
        if (levelInfoNumbers.iterators === 0) {
            genLevelChecker = (gen) => exports.isIterable(gen) ? 'asIterable' : exports.isIterator(gen) ? 'asIterator' : 'asSimpleValue';
        }
        else {
            genLevelChecker = (gen) => exports.isIterable(gen) ? 'asIterable' : 'asSimpleValue';
        }
    }
    else {
        if (levelInfoNumbers.iterators === -1) {
            genLevelChecker = (gen) => 'asSimpleValue';
        }
        else {
            genLevelChecker = (gen) => exports.isIterator(gen) ? 'asIterator' : 'asSimpleValue';
        }
    }
    return genLevelChecker;
};
