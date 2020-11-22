# ComposeGenerator

Compose Generator designed to allow you easily synchronize or embed **generator functions**.

## Usage
lets say you have generator functions **genFunc1**, **genFunc2**, **genFunc3**...
If you want to synchronously use them, i.e. get generators and make synchronous
_.next()_ calls on them. you can use **sync** function.
```javascript
const { sync } = require('compose-generator')

const compose = sync([ genFunc1, genFunc2, genFunc3 ])
const gen = compose([args1, args2, args3]) // args are arguments array of corresponding generator function.

for(const nextResults of gen) {
    // Use results of next calls...
}
```
Above _nextResults_ is results array of _.next()_ calls for each generator.e.g.
```javascript
const nextResults = [
    { done: false, value: 1 } // gen1.next()
    { done: false, value: 'what?' } // gen2.next()
    { done: true, value: 'end' } // gen3.next()
]
```
**Sync** generator will continue until all composed generators are exhausted.
And if some of them is returned earlier, then that final result will be returned
for each _.next()_ call until all they returned.

You can provide instead of array, a map of generator functions to **Sync**. Then _nextResults_
will be map of results.

You can performe manual **.next(arg)** calls, or calculate **super**. for details see **API**.

If you want infinitly make synchronous calls, you can use **Race** composer, which will
reset generator if it`s exhausted, like ticker.

If you want embed them like:
```javascript
for(const v1 of gen1) {
    for(const v2 of gen2) {
        for(const v3 of gen3) {
            console.log({
                key3: v3,
                key2: v2,
                key1: v1,
            })
        }
    }
}
```
You can use **Embed** composer:
```javascript
const { embed } = require('compose-generator')

// Up from down.
const compose = embed({
    key3: gen3,
    key2: gen2,
    key1: gen1,
})
const gen = compose({
    key3: args3,
    key2: args2,
    key1: args1,
}) // args are arguments map of corresponding generator functions.

for(const nextResults of gen) {
    // Use results of next calls...
}
```
In this case it will also reset generators until most outer generator is exhausted.

## API
### Composer
Eache of **sync**, **race** and **embed** functions we will call **composer** function.

Composer functions signature is( **Not A Typescript** ):
```javascript
function composer(generatorFunctions: GeneratorFunction[]
 | { [key: string]: GeneratorFunction })
 : GeneratorFunction<callArgs[] | { [key: string]: callArgs }>
```

**Composer** function call result is a new generator function which is called **compose**.
In cases when we considering generator, returned by **compose** generator function,
we will also use word - **compose**, so be aware of the context.

**Compose** callArgs:

Call argument of **compose** generator function, must be 
corresponding function generators **call arguments arrays**
array(or map, if **generatorFunctions** is map)

If **undefined** provided for some generator function **callArgs**,
it will be called without arguments.

If **undefined** provided for the whole argument **callArgs**,
generator functions will be instantiating without arguments.

Call examples:
- with generator functions **array**:
    ```javascript
    const compose = composer([ genFunc1, genFunc2, genFunc3 ])
    const gen = compose([ [ arg0, arg1 ], [ ] ])
    ```
- with generator functions **map**:
    ```javascript
    // Or with Map
    const compose = composer({ 
        key1: genFunc1,
        key2: genFunc2,
        key3: genFunc3
    })
    const gen = compose({
        key1: [ arg0, arg1 ],
        key2: undefined, // same, as if not provided or empty array provided.
    })
    ```

    ```javascript
    // If no callArgs
        compose()
        // same as ->
        genFunc1()
        genFunc2()
        genFunc3()
    ```

After generator functions composed with some of the provided **composer** functions,
each result of **.next(arg)** call on the **compose** generator will be an array( or map,
depending on what provided to composer) of next call results for each generator included in composition, e.g.
```javascript
const nextResults = [
    { done: false, value: 1 } // gen1.next(arg1)
    { done: false, value: 'what?' } // gen2.next(arg2)
    { done: true, value: 'end' } // gen3.next(arg3)
]
```

### Sync
**Sync** _extends_ **Composer**

**Compose** .next(nextArg):

**.next(nextArg)** call argument must be **function**, **undefined**, or an array(or map if **generatorFunctions** is map) of **.next(arg)** call arguments for appropriate function generators,


If **nextArg** is function, it`s signature is( **Not A Typescript** ):
```javascript
(lastResults: IteratorResult<any, any>[]
| { [key: string]?: IteratorResult<any, any> },
key: string) => any
```
- **lastResults** is an array(or map) of results of compositions 
  last generators **.next(arg)** calls.
- **key** is a key of current generator
- **return** is a value to call **currentGenerator.next()** with.

This function will be called for each generator from start, and its returned value will be used
as **.next()** call argument for appropriate generator.


Next Call examples:
- with **array** or **map**:
    ```javascript
    const compose = sync([ genFunc1, genFunc2, genFunc3 ])
    const gen = compose([ [ arg0, arg1 ], [ ] ])

    gen.next([nextArg1, nextArg2])
    // same as
    gen1.next(nextArg1)
    gen2.next(nextArg2)
    gen3.next()
    ```
- with **undefined**
    ```javascript
    const compose = sync([ genFunc1, genFunc2, genFunc3 ])
    const gen = compose([ [ arg0, arg1 ], [ ] ])

    gen.next()
    // same as
    gen1.next()
    gen2.next()
    gen3.next()
    ```
- with **function**
    ```javascript
    const compose = sync([ genFunc1, genFunc2, genFunc3 ])
    const gen = compose([ [ arg0, arg1 ], [ ] ])

    let lastKey
    gen.next((lastResults, key) => {
        const lastKeyTmp = lastKey
        lastKey = key
        if(!lastKeyTmp) return // same as gen1.next()

        return lastResults[lastKeyTmp].value // same as super of next values
    })
    // same as super.
    const g1 = gen1.next()
    const g2 = gen2.next(g1.value)
    const g3 = gen3.next(g2.value)
    ```
If some of the generators exhausted, it's last value will be used until all generators exhausted.
i.e. if some of them finished with value `{ done: true, value: 'finish' }`, it will be returned for subsequent **compose** next calls.

### Race
**Race** _extends_ **Composer**

The main difference of **Race** from **Sync**, is that it will reset generators each time they exhausted, so return values will not be included in results.
Reset will be performed with same **callArgs** provided to **Composer**.

### Embed
**Embed** _extends_ **Composer**

**Compose** .next(nextArg):

**.next(nextArg)** call argument must be **function**, or any other value.

If **nextArg** is function, it`s signature is same
as for **Race** and **Sync**, But with arguments different description
( **Not A Typescript** ):
```javascript
(lastResults: IteratorResult<any, any>[]
| { [key: string]?: IteratorResult<any, any> },
key: string) => any
```
- **lastResults** is an array(or map) of results of compositions 
  last generators **.next(arg)** calls.
- **key** is a key of current generator
- **return** is a value to call **currentGenerator.next()** with.

This function will be called each time starting from first generator, and continue until some of them is not exhausted, if they are all exhausted, **compose** generator will be returned.

Each time it is called, its returned value will be used
as **.next()** call argument for appropriate generator(for which it is called).
If after **.next()** generator is exhausted, i.e. `done=true`,
this function will be called for next generator with lastResults containing appropriate return values for last generators.

If some of the generators exhausted, it will be reseted with initial **callArgs**.

Next Call examples:
- with **NotFunction**:
    ```javascript
    const compose = embed([ genFunc1, genFunc2, genFunc3 ])
    const gen = compose([ [ arg0, arg1 ], [ ] ])

    gen.next(nextArg)
    // same as
    const gen1Val = gen1.next(nextArg)
    if(gen1Val.done) {
        gen2.next(nextArg)
        // ... and so on
    } else {
        // next will be not called
    }
    // Finial merged state will be here.
    ```
- with **function**
    ```javascript
    const compose = sync([ genFunc1, genFunc2, genFunc3 ])
    const gen = compose([ [ arg0, arg1 ], [ ] ])

    let lastKey
    gen.next((lastResults, key) => {
        // This function will be called for first generator every time
        // and subsequent calles will be performed, when it is returned after calling .next()
    })
    ```