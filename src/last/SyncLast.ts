type CallArgs<T extends ((...args: any[]) => Generator)[] | {
    [key: string]: ((...args: any[]) => Generator)
}> = T extends any[]
    ? (any[] | undefined)[]
    : { [P in keyof T]?: any[] };

type ComposeResult<T extends ((...args: any[]) => Generator)[] | {
    [key: string]: ((...args: any[]) => Generator)
}> = T extends any[]
    ? IteratorResult<any, any>[]
    : { [P in keyof T]: IteratorResult<any, any> }


function initializeGenerators(
    generatorFunctions: { [key: string]: (...args: any[]) => Generator },
    callArgs: { [key: string]: any }
) {
    const initializedGenerators: { [key: string]: Generator } = {}

    let stateMap: {
        [key: string]: {
            done: boolean,
            returnedValue?: any
        }
    } = {} as any
    let count = 0

    for (const key in generatorFunctions) {
        const args = callArgs[key]
        const genFunc = generatorFunctions[key]
        if (args instanceof Array) {
            initializedGenerators[key] = genFunc(...args)
        } else {
            initializedGenerators[key] = genFunc()
        }

        stateMap[key] = { done: false }
        count++
    }
    return {
        stateMap,
        count,
        initializedGenerators,
    }
}

export function sync<T extends ((...args: any[]) => Generator)[] | {
    [key: string]: ((...args: any[]) => Generator)
}>(generatorFunctions: T) {
    return function* (args?: CallArgs<T>): Generator<ComposeResult<T>, ComposeResult<T>, any> {
        const callArgs = (args ? args : {}) as { [key: string]: any }
        const {
            stateMap,
            count,
            initializedGenerators,
        } = initializeGenerators(
            generatorFunctions as { [key: string]: (...args: any[]) => Generator },
            callArgs
        )


        let doneCount = 0
        let nextArg: any = undefined
        while (true) {
            const result = (generatorFunctions instanceof Array
                ? Array(generatorFunctions.length)
                : {}) as { [key: string]: IteratorResult<any, any> }

            for (let key in initializedGenerators) {
                if (stateMap[key].done) {
                    result[key] = { ...stateMap[key].returnedValue }
                    continue
                }

                const gen = initializedGenerators[key]
                const nextVal = gen.next(nextArg)
                if (nextVal.done) {
                    doneCount++
                    stateMap[key].done = true
                    stateMap[key].returnedValue = nextVal

                    result[key] = { ...nextVal }
                } else {
                    result[key] = { ...nextVal }
                }
            }

            if (doneCount !== count) {
                nextArg = yield result as any
            } else {
                return result as any
            }
        }
    }
}

export function sequance<T extends ((...args: any[]) => Generator)[] | {
    [key: string]: ((...args: any[]) => Generator)
}>(generatorFunctions: T) {
    return function* (args?: CallArgs<T>) {
        const callArgs = (args ? args : {}) as { [key: string]: any }
        const {
            count,
            initializedGenerators,
        } = initializeGenerators(
            generatorFunctions as { [key: string]: (...args: any[]) => Generator },
            callArgs
        )


        let doneCount = 0
        const currentState = (generatorFunctions instanceof Array
            ? Array(generatorFunctions.length)
            : {}) as { [key: string]: IteratorResult<any, any> }

        for (const key in initializedGenerators) {
            const gen = initializedGenerators[key]
            const initialState = gen.next()

            currentState[key] = initialState
            if (initialState.done) {
                doneCount++
            }
        }

        type IStep = {
            step?: ReturnType<typeof stepsGenerator>
            state: ComposeResult<T>
            complete: boolean
        }

        while (true) {
            if (doneCount !== count) {
                const gen = stepsGenerator()
                gen.next()

                const step: IStep = {
                    step: gen,
                    state: cpCurrentState(),
                    complete: false,
                }
                yield step
                gen.return(undefined as any)
            } else {
                const gen = stepsGenerator()
                gen.next()

                const step: IStep = {
                    // step: gen,
                    state: cpCurrentState(),
                    complete: true,
                }
                return step
            }
        }

        type IStepYield = {
            key: string,
            newState: IteratorResult<any, any>,
            state: ComposeResult<T>,
            complete: Boolean,
        }

        type IStepReturn = {
            key?: string,
            newState?: IteratorResult<any, any>,
            state: ComposeResult<T>,
            complete: Boolean,
        }

        function* stepsGenerator() {
            let nextArg: any = yield {} as IStepYield;

            for (const key in currentState) {
                if (!currentState[key].done) {
                    const gen = initializedGenerators[key]
                    const newState = gen.next(nextArg)

                    currentState[key] = newState
                    if (newState.done) {
                        doneCount++
                    }
                }

                const stepYield: IStepYield = {
                    key,
                    newState: { ...currentState[key] },
                    state: cpCurrentState(),
                    complete: doneCount === count,
                }
                nextArg = yield stepYield
            }

            const stepYield: IStepReturn = {
                state: cpCurrentState(),
                complete: doneCount === count,
            }
            return stepYield
        }

        function cpCurrentState(): ComposeResult<T> {
            const currentStateCopy = (generatorFunctions instanceof Array
                ? Array(generatorFunctions.length)
                : {}) as { [key: string]: IteratorResult<any, any> }

            for (const key in currentState) {
                currentStateCopy[key] = { ...currentState[key] }
            }

            return currentStateCopy as any
        }
    }
}

// const gen = sequance({
//     a: function* (start?: number) {
//         if (start !== undefined) {
//             yield start
//         }
//         yield 1
//         yield 2
//         yield 3
//         return 4
//     },
//     b: function* () {
//         yield 'as'
//         // yield 'bas'
//         return 'tas'
//     }
// })({ a: [1] })

// const step1 = gen.next().value.step
// if (step1) {
//     const nextState = step1.next()
//     nextState.value.newState
//     if (nextState.done) {
//         nextState.value.key
//     } else {
//         nextState.value.state.a
//     }
// }



// console.log(step1)
// console.log(
//     step1.next('as' as any),
//     step1.next(2),
// );
// const step2 = gen.next().value;
// console.log(step2)
// const res = step1.next()
// if (res.done) {
//     res.value
// }
// step1.next()
// step1.next()
// step1.next()
// step1.next()
// console.log(
//     step2.next('as' as any),
//     step2.next(2),
//     step2.next(2),
//     step2.next(2),
// )
// console.log(gen.next().value.next())
// console.log(gen.next().value.next())
// const step3 = gen.next()
// console.log(
//     'step3.value.next(),',
//     step3.value.next(),
//     step3.value.next(),
//     step3.value.next(),
//     step3.value.next(),
// )
// const step4 = gen.next()
// console.log(
//     'step4.value.next(),',
//     step4.value.next(),
//     step4.value.next(),
//     step4.value.next(),
//     step4.value.next(),
// )









// console.log(
//     gen.next(),
//     gen.next(),
//     gen.next(),
//     gen.next(),
//     gen.next(),
//     gen.next(),
//     gen.next(),
//     gen.next(),
// )
// // for(let val of gen) {
//     // console.log(val)
// // }

// const f = function* (start?: number) {
//     if (start !== undefined) {
//         yield start
//     }
//     yield 1
//     yield 2
//     yield 3
//     return 'asda'
// }
// f().return()