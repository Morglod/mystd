interface Thenable<T> {
    (): T;
    <T2>(then: (x: T) => T2): Thenable<T2>;
}

function monad<T>(x: T, transform: (x: any) => any): Thenable<T> {
    return (then?: any) => {
        if (!then) return transform(x);
        const x2 = then(transform(x));
        return monad(x2, transform);
    };
}

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
