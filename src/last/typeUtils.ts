// // Typescript Custom Utility Types.

// /**
//  * Creates new Interface by requiring _keys_ from **B**.
//  */
// export type RequireFields<T, B extends keyof NonNullable<T>> = Required<
//     Pick<
//         NonNullable<T>, B
//     >
// > & Omit<NonNullable<T>, B>

// /**
//  * Creates new Interface by requiring _keys_ Except keys from **B**.
//  */
// export type RequireExceptFields<T, B extends keyof NonNullable<T>> = Required<
//     Omit<
//         NonNullable<T>, B
//     >
// > & Pick<NonNullable<T>, B>


// export type NotFunction<T> = T extends Function ? never : T;

// export type GeneratorFunctionGenerics<G extends (...args: any[]) => Generator<any, any, any>> =
//     G extends (...args: any[]) => Generator<infer T, infer TReturn, infer TNext>
//     ? [T, TReturn, TNext]
//     : never


// export type Writable<T extends { [x: string]: any }> = { -readonly [P in keyof T]: T[P] }

// export type DeepWritable<T> = { -readonly [P in keyof T]: DeepWritable<T[P]> };

// // Composition Type Helpers
// // _______________________________
// // export type GenMap<T> = { [P in keyof T]: T[P] extends Composition<infer R> ? Composition<R> : T[P] }
// // _______________________________
// // _______________________________
// // _______________________________

// // export type GenericArgument<T> = T extends Composition<infer R> ? R : never;