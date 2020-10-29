export function lazyComputeOnce<T, ThisT>(this: ThisT, call: (this: ThisT) => T): () => T {
    let called = false;
    let value!: T;

    return () => {
        if (called === false) {
            value = call.apply(this);
            called = true;
        }
    
        return value;
    };
}

function isArraysEqual(oldAr: any[], newAr: any[]) {
    if (oldAr.length !== newAr.length) return false;
    for (let i = 0; i < oldAr.length; ++i) {
        if (oldAr[i] !== newAr[i]) return false;
    }
    return true;
}
// export function memoCompute<T, ThisT>(this: ThisT,
//     call: (this: ThisT) => T,
//     depends: (keyof ThisT)[] | ((this: ThisT) => any[])
// ): () => T {
//     if (typeof depends === 'function') return memoComputeStrDeps.call(this, call as any, depends as any) as any;
//     return memoComputeKeyDeps.call(this, call as any, depends as any) as any;
// }

export function memoComputeStrDeps<T, ThisT>(this: ThisT,
    call: (this: ThisT) => T,
    depends: (this: ThisT) => any[],
): () => T {
    let called = false;
    let value!: T;
    let dependency: any[] = [];

    return () => {
        if (called === true) {
            const newDeps = depends.apply(this);
            if (isArraysEqual(dependency, newDeps) === false) {
                value = call.apply(this);
                dependency = newDeps;
            }
        } else {
            value = call.apply(this);
            called = true;
            dependency = depends.apply(this);
        }
    
        return value;
    };
}

// export function memoComputeKeyDeps<T, ThisT>(this: ThisT,
//     call: (this: ThisT) => T,
//     depends: (keyof ThisT)[]
// ): () => T {
//     let called = false;
//     let value!: T;
//     let dependency: any[] = [];

//     return () => {
//         if (called === true) {
//             const newDeps = depends.apply(this);
//             if (isArraysEqual(dependency, newDeps) === false) {
//                 value = call.apply(this);
//                 dependency = newDeps;
//             }
//         } else {
//             value = call.apply(this);
//             called = true;
//             dependency = depends.apply(this);
//         }
    
//         return value;
//     };
// }