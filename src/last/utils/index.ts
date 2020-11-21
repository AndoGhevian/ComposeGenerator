export const isIterator = (obj: any) => {
    if (obj != null && typeof obj.next === 'function') {
        return true
    }
    return false
}

export const isIterable = (obj: any) => {
    if (obj != null && typeof obj[Symbol.iterator] === 'function') {
        return true
    }
    return false
}

export const isGenerator = (val: any) => {
    if (val != null && val.constructor.name === 'GeneratorFunction') {
        return true
    }
    return false
}

export const createLevelChecker = (levelInfo: {
    useIterables?: boolean,
    useIterators?: boolean,
    usePriority: 'iterables' | 'iterators'
}) => {
    /**
     * Describe level Info in numbers.
     */
    const levelInfoNumbers = {
        iterables: 0,
        iterators: 0,
    }
    if (levelInfo.usePriority === 'iterables') levelInfoNumbers.iterables = 1
    if (!levelInfo.useIterables) levelInfoNumbers.iterables = -1

    levelInfoNumbers.iterators = levelInfoNumbers.iterables < 1 ? 1 : 0
    if (!levelInfo.useIterators) levelInfoNumbers.iterators = -1

    /**
     * Returns how to work with provided value:
     * - Work as with simple value.
     * - Work as with iterable.
     * - Work as with iterator.
     * @param gen any value.
     */
    let genLevelChecker!: (gen: any) => 'asIterator' | 'asIterable' | 'asCombination' | 'asSimpleValue'
    if (levelInfoNumbers.iterables === 0 && levelInfoNumbers.iterators === 1) {
        genLevelChecker = (gen) => isIterator(gen) ? 'asIterator' : isIterable(gen) ? 'asIterable' : 'asSimpleValue'
    } else if (levelInfoNumbers.iterables === 0) {
        genLevelChecker = (gen) => isIterable(gen) ? 'asIterable' : 'asSimpleValue'
    } else if (levelInfoNumbers.iterables === 1) {
        if (levelInfoNumbers.iterators === 0) {
            genLevelChecker = (gen) => isIterable(gen) ? 'asIterable' : isIterator(gen) ? 'asIterator' : 'asSimpleValue'
        } else {
            genLevelChecker = (gen) => isIterable(gen) ? 'asIterable' : 'asSimpleValue'
        }
    } else {
        if (levelInfoNumbers.iterators === -1) {
            genLevelChecker = (gen) => 'asSimpleValue'
        } else {
            genLevelChecker = (gen) => isIterator(gen) ? 'asIterator' : 'asSimpleValue'
        }
    }

    return genLevelChecker
}