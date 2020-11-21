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
declare type ComposeNext<T extends ((...args: any[]) => Generator)[] | {
    [key: string]: ((...args: any[]) => Generator);
}> = T extends any[] ? ((lastResults: IteratorResult<any, any>[], key: string) => any) | (any[] | undefined) : ((lastResults: {
    [P in keyof T]: IteratorResult<any, any> | undefined;
}, key: string) => any) | ({
    [P in keyof T]?: IteratorResult<any, any>;
} | undefined);
export default function sync<T extends ((...args: any[]) => Generator)[] | {
    [key: string]: ((...args: any[]) => Generator);
}>(generatorFunctions: T): (args?: CallArgs<T> | undefined) => Generator<ComposeResult<T>, ComposeResult<T>, ComposeNext<T>>;
export {};
