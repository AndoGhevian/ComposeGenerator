"use strict";
// import {
//     NotFunction,
// } from "./typeUtils";
// export interface InitialArgs {
//     [key: string]: InitialArgs | any[] | undefined
// }
// export type Composition = ((...args: any[]) => Generator)
//     | { [key: string]: Composition }
//     | Composition[]
// export type CompositionCallArgs<T extends Composition> = T extends ((...args: any[]) => Generator)
//     ? any[]
//     : T extends Composition[]
//     ? (any[] | undefined)[]
//     : T extends { [key: string]: Composition }
//     ? { [P in keyof T]?: CompositionCallArgs<T[P]> }
//     : never
// export type CompositionGeneratorResult<T extends Composition> = T extends ((...args: any[]) => Generator)
//     ? IteratorResult<any, any>
//     : T extends Composition[]
//     ? any[]
//     : T extends { [key: string]: Composition }
//     ? { [P in keyof T]: CompositionGeneratorResult<T[P]> }
//     : never
// // export type CompositionCallArgs<T extends Composition> = T extends ((...args: infer X) => Generator)
// //     ? X
// //     : T extends { [key: string]: Composition }
// //     ? { [P in keyof T]: CompositionCallArgs<T[P]> }
// //     : never
// // { [P in keyof T]?: T[P] extends Composition<infer R> ? (CompositionCallArgs<R> | any[]) : any[] }
