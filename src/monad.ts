type Pass<
    T,
    Y,
    Z extends Pass<Y, any, any>,
> = (map?: (x: T) => Y) => Z;

export function monad<T, Y>(
    x: T,
    transform: (x2: any) => any,
): Pass<T, Y, any> {
    return (map?: any) => {
        if (!map) return transform(x);
        return monad(map(transform(x)), transform);
    };
}

monad(10, x => {
    if (typeof x === 'number') return x + 1;
    return x;
})
    (x1 => {
        return console.log(x1), x1;
    })
    ((x2: number) => x2.toString())
    ((x3: any) => console.log(x3));
    
    // monad(10, x => {
    //     if (typeof x === 'number') return x + 1;
    //     return x;
    // })
    //     (x1 => {
    //         return console.log(x1), x1;
    //     })
    //     ((x2: number) => x2.toString())
    //     ((x3: any) => console.log(x3));