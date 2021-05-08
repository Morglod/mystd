import Crypto from 'crypto';

// somewhere from stackoverflow

export function deepSortObjectKeys<T>(obj: T): T {
    if (obj == null || obj == undefined || typeof obj !== 'object') {
        return obj;
    }

    return Object.keys(obj).sort().reduce((acc, key) => {
        if (Array.isArray((obj as any)[key])) {
            acc[key] = (obj as any)[key].map(deepSortObjectKeys);
        } else if (typeof (obj as any)[key] === 'object') {
            acc[key] = deepSortObjectKeys((obj as any)[key]);
        } else {
            acc[key] = (obj as any)[key];
        }
        return acc;
    }, {} as any);
}

export function jsonHash(obj: any, alg: string = 'sha1') {
    const sortedObj = deepSortObjectKeys(obj);
    const jsonStr = JSON.stringify(sortedObj, (k, v) => {
        if (typeof v === 'function') {
            return v.toString();
        }
        return v;
    });

    const hash = Crypto.createHash(alg);
    hash.update(jsonStr);
    return hash.digest('hex');
}