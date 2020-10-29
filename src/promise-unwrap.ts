export type PromiseUnwrap<T = any> = {
    resolve: (x: T) => void,
    reject: (reason?: any) => any,
    promise: Promise<T>,
};

export function promiseUnwrap<T = any>(): PromiseUnwrap<T> {
    let resolve: any, reject: any;
    const promise = new Promise<T>((res, rej) => {
        resolve = (x: T) => res(x);
        reject = (reason: any) => rej(reason);
    });

    return { resolve, reject, promise };
}

export type PromiseUnwrapExt<T = any> = {
    resolve: (x: T) => void,
    reject: (reason?: any) => any,

    isRejected: boolean,
    isResolved: boolean,

    promise: Promise<T>,
};

export function promiseUnwrapExt<T = any>(): PromiseUnwrapExt<T> {
    let resolve: any, reject: any, obj: PromiseUnwrapExt<T>;
    
    const promise = new Promise<T>((res, rej) => {
        resolve = (x: T) => {
            obj.isResolved = true;
            res(x);
        };
        reject = (reason: any) => {
            obj.isRejected = true;
            rej(reason);
        };
    });

    obj = {
        resolve,
        reject,
        promise,

        isRejected: false,
        isResolved: false,
    };

    return obj as any;
}