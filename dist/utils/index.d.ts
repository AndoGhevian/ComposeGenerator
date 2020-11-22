export declare function cpResult(result: {
    [key: string]: IteratorResult<any, any>;
}): {
    [key: string]: IteratorResult<any, any>;
};
export declare function initializeGenerators(generatorFunctions: {
    [key: string]: (...args: any[]) => Generator;
}, callArgs: {
    [key: string]: any;
}): {
    stateMap: {
        [key: string]: {
            done: boolean;
            returnedValue?: any;
        };
    };
    count: number;
    initializedGenerators: {
        [key: string]: Generator<unknown, any, unknown>;
    };
};
export declare function initializeSingleGenerator(key: string, generatorFunctions: {
    [key: string]: (...args: any[]) => Generator;
}, callArgs: {
    [key: string]: any;
}): Generator<unknown, any, unknown>;
