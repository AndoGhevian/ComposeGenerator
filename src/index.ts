export { default as embed } from './Embed'
export { default as race } from './Race'
export { default as sync } from './Sync'
export { isCompose } from './utils'
export {
    Compose,
    Composer,
    ComposeType,
    ComposeResult,
    ComposeNext,
} from './commonTypes'


import sync from './Sync'
import embed from './Embed'
import race from './Race'
import { inspect } from 'util'

const compose = embed({
    outer: function* () {
        yield 1
        yield 2
        yield 3
        yield 4
    },
    inner: sync({
        fir: function* () {
            yield 1
            yield 2
            yield 3
            yield 4
            return 5
        },
        sec: function* () {
            yield 'Welcome Andy 1'
            yield 'welcome Andy 2'
            return 'welcome Andy 3'
        },
        third: function* (welcome: string) {
            yield `Welcome ${welcome ? welcome : 'default'} 1`
            yield `Welcome ${welcome ? welcome : 'default'} 2`
            return `Welcome ${welcome ? welcome : 'default'} 3`
        }
    }),
})

const calledCompose = compose({
    inner: {
        third: ['Alonia'],
    }
})

log(
    calledCompose.next()
)
log(
    calledCompose.next()
)
log(
    calledCompose.next()
)
log(
    calledCompose.next()
)
log(
    calledCompose.next()
)





function log(obj: any) {
    console.log(inspect(obj, false, Infinity))
}
// console.log(
//     calledCompose.next()
// )
// console.log(
//     calledCompose.next()
// )
// console.log(
//     calledCompose.next()
// )
// console.log(
//     calledCompose.next()
// )