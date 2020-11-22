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
interface CustomGenerator<T extends ((...args: any[]) => Generator)[] | {
    [key: string]: ((...args: any[]) => Generator);
}> extends Generator<ComposeResult<T>, ComposeResult<T>> {
    next<B>(arg0?: B extends Function ? ((lastResults: T extends any[] ? IteratorResult<any, any>[] : {
        [P in keyof T]?: IteratorResult<any, any>;
    }, key: string) => any) : any): IteratorResult<ComposeResult<T>, ComposeResult<T>>;
    [Symbol.iterator](): CustomGenerator<T>;
}
export default function embed<T extends ((...args: any[]) => Generator)[] | {
    [key: string]: ((...args: any[]) => Generator);
}>(generatorFunctions: T): (args?: CallArgs<T> | undefined) => CustomGenerator<T>;
export {};
