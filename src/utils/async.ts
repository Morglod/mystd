export async function sleep(ms: number) {
    return new Promise(resolve => {
        setTimeout(() => resolve(), ms);
    })
}

export function promiseUnwrap<T = any>(): {
    resolve: (x: T) => void,
    reject: (reason?: any) => any,
    promise: Promise<T>,
} {
    let resolve: any, reject: any;
    const promise = new Promise<T>((res, rej) => {
        resolve = (x: T) => res(x);
        reject = (reason: any) => rej(reason);
    });

    return { resolve, reject, promise };
}

export function promiseUnwrapExt<T = any>(): {
    resolve: (x: T) => void,
    reject: (reason?: any) => any,

    isRejected: boolean,
    isResolved: boolean,

    promise: Promise<T>,
} {
    let resolve: any, reject: any, obj: ReturnType<typeof promiseUnwrapExt>;
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