export declare const ComposeType: ['sync', 'embed', 'race'];
export declare type ComposeType = (typeof ComposeType)[number];
export interface Compose<CT extends ComposeType = any, T extends {
    [key: string]: ((...args: any[]) => Generator);
} = any> {
    composeType: CT;
    emptyNextArgs: ComposeNext<CT, T>;
    emptyCallArgs: CallArgs<T>;
    (args?: CallArgs<T>): Generator<ComposeResult<T>, ComposeResult<T>, ComposeNext<CT, T> | undefined>;
}
export interface Composer<CT extends ComposeType = any> {
    <T extends {
        [key: string]: ((...args: any[]) => Generator);
    }>(generatorFunctions: T): Compose<CT, T>;
}
export declare type CallArgs<T extends {
    [key: string]: ((...args: any[]) => Generator);
}> = {
    [P in keyof T]?: T[P] extends Compose ? Parameters<T[P]>[0] : any[];
};
declare type ExtractComposeResult<T> = T extends (...args: any[]) => Generator<infer X> ? X : never;
export declare type ComposeResult<T extends {
    [key: string]: ((...args: any[]) => Generator);
}> = {
    [P in keyof T]: T[P] extends Compose ? ExtractComposeResult<T[P]> : IteratorResult<any, any>;
};
declare type ExtractComposeNext<T extends Compose> = T extends (...args: any[]) => Generator<any, any, infer X> ? X : never;
export declare type ComposeNext<CT extends ComposeType, T extends {
    [key: string]: ((...args: any[]) => Generator);
}> = (((lastResults: {
    [P in keyof T]?: T[P] extends Compose ? ExtractComposeResult<T[P]> : IteratorResult<any, any>;
}, key: keyof T, lastNextArgs: ComposeNext<CT, T>, parentCompose: Compose<CT, T>) => any)) | {
    [P in keyof T]?: T[P] extends Compose ? ExtractComposeNext<T[P]> : any;
};
export {};
