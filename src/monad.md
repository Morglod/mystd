# `monad<T>(x, transform)`

No one need monad  
Never use it

Good example of `Thenable<T>` implementation

```ts
const rrr = monad(10, x => {
    if (typeof x === 'number') return x + 1;
    return x;
})
(x1 => {
    return console.log(x1), x1;
})
((x2) => x2.toString())
((x3) => { return console.log(x3), x3; })
();

console.log('rrr', rrr);
```