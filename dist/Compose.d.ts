declare type CallArgs<T extends ((...args: any[]) => Generator)[] | {
    [key: string]: ((...args: any[]) => Generator);
}> = T extends any[] ? (any[] | undefined)[] : {
    [P in keyof T]?: any[];
};
declare type GenResult<T extends ((...args: any[]) => Generator)[] | {
    [key: string]: ((...args: any[]) => Generator);
}> = T extends any[] ? IteratorResult<any, any>[] : {
    [P in keyof T]: IteratorResult<any, any>;
};
export declare function sync<T extends ((...args: any[]) => Generator)[] | {
    [key: string]: ((...args: any[]) => Generator);
}>(generatorFunctions: T): (args?: CallArgs<T> | undefined) => Generator<GenResult<T>, GenResult<T>, any>;
export {};
