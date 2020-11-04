export interface Thenable<T> {
    (): T;
    <T2>(then: (x: T) => T2): Thenable<T2>;
}

export function monad<T>(x: T, transform: (x: any) => any): Thenable<T> {
    return (then?: any) => {
        if (!then) return transform(x);
        const x2 = then(transform(x));
        return monad(x2, transform);
    };
}
