export function arrayToMap<T, MapKey extends keyof T>(
    array: Array<T>,
    mapKey: MapKey | ((item: T, itemIndex: number, array: T[]) => MapKey)
): {
    [k in MapKey]: T
} {
    const out = {} as any;
    for (let i = 0; i < array.length; ++i) {
        const x = array[i];
        let k;
        if (typeof mapKey === 'function') {
            k = x[mapKey(x, i, array)];
        }
        else {
            k = out[x[mapKey]];
        }
        if (k === undefined) continue;
        out[k] = x;
    }

    return out;
}

export function normalizeKeys<T extends { [x: string]: any }>(
    x: any,
    schema: {
        [x in keyof T]: any[]
    }
): T {
    x = { ...x };
    for (const k in schema) {
        if (k in x) {
            if (!schema[k].includes(x[k])) {
                x[k] = schema[k][0];
            }
        } else {
            x[k] = schema[k][0];
        }
    }

    return x;
}
