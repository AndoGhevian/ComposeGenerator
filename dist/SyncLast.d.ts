declare type CallArgs<T extends ((...args: any[]) => Generator)[] | {
    [key: string]: ((...args: any[]) => Generator);
}> = T extends any[] ? (any[] | undefined)[] : {
    [P in keyof T]?: any[];
};
declare type ComposeResult<T extends ((...args: any[]) => Generator)[] | {
    [key: string]: ((...args: any[]) => Generator);
}> = T extends any[] ? IteratorResult<any, any>[] : {
    [P in keyof T]: IteratorResult<any, any>;
};
export declare function sync<T extends ((...args: any[]) => Generator)[] | {
    [key: string]: ((...args: any[]) => Generator);
}>(generatorFunctions: T): (args?: CallArgs<T> | undefined) => Generator<ComposeResult<T>, ComposeResult<T>, any>;
export declare function sequance<T extends ((...args: any[]) => Generator)[] | {
    [key: string]: ((...args: any[]) => Generator);
}>(generatorFunctions: T): (args?: CallArgs<T> | undefined) => Generator<{
    step?: Generator<{
        key: string;
        newState: IteratorResult<any, any>;
        state: ComposeResult<T>;
        complete: Boolean;
    }, {
        key?: string | undefined;
        newState?: IteratorYieldResult<any> | IteratorReturnResult<any> | undefined;
        state: ComposeResult<T>;
        complete: Boolean;
    }, any> | undefined;
    state: ComposeResult<T>;
    complete: boolean;
}, {
    step?: Generator<{
        key: string;
        newState: IteratorResult<any, any>;
        state: ComposeResult<T>;
        complete: Boolean;
    }, {
        key?: string | undefined;
        newState?: IteratorYieldResult<any> | IteratorReturnResult<any> | undefined;
        state: ComposeResult<T>;
        complete: Boolean;
    }, any> | undefined;
    state: ComposeResult<T>;
    complete: boolean;
}, unknown>;
export {};
