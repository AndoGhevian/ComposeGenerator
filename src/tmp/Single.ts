// export interface SingleCompose {
//     composeType: 'single'
//     (...args: any[]): Generator<any, any, any>
// }

// export interface SingleComposer {
//     (generatorFunction: (...args: any[])=> Generator): SingleCompose
// }

// const single: SingleComposer = function single(generatorFunction) {
//     const compose = function*(...args: any[]) {
//         let gen = generatorFunction(...args)
//         let nextVal = gen.next()
//         if(nextVal.done) {
//             return nextVal
//         }

//         let nextArg = yield nextVal
//         while(true) {
//             nextVal = gen.next(nextArg)
//             if(nextVal.done) {
//                 gen = generatorFunction(...args)
//                 nextVal = gen.next()
//             }
//             nextArg = yield nextVal
//         }
//     } as SingleCompose
//     compose.composeType = 'single'

//     return compose
// } 


// export default single



// Testing Single composer
// import single from './Single'

// const genFunc = single(function*(start: number) {
//     yield start
//     yield 1
//     yield 2
// })

// for(const val of genFunc(111)) {
//     console.log(val)
// }