export declare type CallArgs<T extends ((...args: any[]) => Generator)[] | {
    [key: string]: ((...args: any[]) => Generator);
}> = T extends any[] ? (any[] | undefined)[] : {
    [P in keyof T]?: any[];
};
export declare type ComposeResult<T extends ((...args: any[]) => Generator)[] | {
    [key: string]: ((...args: any[]) => Generator);
}> = T extends any[] ? IteratorResult<any, any>[] : {
    [P in keyof T]: IteratorResult<any, any>;
};
export declare type ComposeNext<T extends ((...args: any[]) => Generator)[] | {
    [key: string]: ((...args: any[]) => Generator);
}> = T extends any[] ? ((lastResults: IteratorResult<any, any>[], key: string) => any) | (any[] | undefined) : ((lastResults: {
    [P in keyof T]?: IteratorResult<any, any> | undefined;
}, key: string) => any) | ({
    [P in keyof T]?: any;
} | undefined);
