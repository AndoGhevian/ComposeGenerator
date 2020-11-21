export declare const isIterator: (obj: any) => boolean;
export declare const isIterable: (obj: any) => boolean;
export declare const isGenerator: (val: any) => boolean;
export declare const createLevelChecker: (levelInfo: {
    useIterables?: boolean;
    useIterators?: boolean;
    usePriority: 'iterables' | 'iterators';
}) => (gen: any) => 'asIterator' | 'asIterable' | 'asCombination' | 'asSimpleValue';
