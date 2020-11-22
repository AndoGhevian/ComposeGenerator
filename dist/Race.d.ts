import { CallArgs, ComposeNext, ComposeResult } from "./commonTypes";
export default function race<T extends ((...args: any[]) => Generator)[] | {
    [key: string]: ((...args: any[]) => Generator);
}>(generatorFunctions: T): (args?: CallArgs<T> | undefined) => Generator<ComposeResult<T>, ComposeResult<T>, ComposeNext<T>>;
