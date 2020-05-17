import { nullObj } from "./utils/base";

export function memoizeKeysDefaultIsEqual<K, V>(key: K, oldV: V, newV: V) {
    return oldV === newV;
}

export function memoizeKeysDefaultPreTransform<T>(x: any): T {
    return x;
}

export function memoizeKeys<
    T,
    J=T,
    _Input=T,
>(
    newKey?: (value: T[any], key: string, _input: _Input) => J,
    updateKey?: (value: T[any], key: string, oldValue: J, _input: _Input) => J,
    deleteKey?: (value: J, key: string, _input: _Input) => void,

    /** compare for update */
    isEqual: (key: string, oldValue: T[any], value: T[any]) => boolean = memoizeKeysDefaultIsEqual,
    preTransform: (x: _Input) => T = memoizeKeysDefaultPreTransform,
) {
    let lastX: {
        [key: string]: {
            originalValue: T[any],
            value: J,
        }|undefined
    } = nullObj({});

    const push = (_input: _Input) => {
        const x = preTransform(_input);

        // pick new
        for (const k in x) {
            if (!(k in lastX)) {
                lastX[k] = ({
                    value: newKey ? newKey(x[k], k, _input) : (x[k] as any as J),
                    originalValue: x[k],
                });
            }
        }

        // delete
        for (const oldK in lastX) {
            if (!(oldK in x)) {
                if (lastX[oldK]) deleteKey && deleteKey(lastX[oldK]!.value, oldK, _input);
                delete lastX[oldK];
            }
        }

        // update
        for (const k in x) {
            if (!isEqual(k, lastX[k]!.originalValue, x[k])) {
                lastX[k] = {
                    originalValue: x[k],
                    value: updateKey ? updateKey(x[k], k, lastX[k]!.value, _input) : (x[k] as any as J),
                };
            }
        }
    };

    return push;
}

export function memoizeState<Input, T>(
    create: (input: Input) => T,
    update: (input: Input, oldState: T) => T,
    inputEquality: 'byRef' | 'byFields' | ((oldInput: Input, newInput: Input) => boolean) = 'byFields',
) {
    let init=true;

    let state: T;
    let oldInput: Input;

    return (input: Input) => {
        if (init) {
            state = create(input);
            oldInput = input;
            init = false;
        } else {
            if (inputEquality === 'byRef') {
                if (oldInput === input) return;
            }
            else if (inputEquality === 'byFields') {
                const e = Object.entries(input);
                if (e.length === Object.keys(oldInput).length) {
                    if (e.every(([k,v]) => (oldInput as any)[k] === v)) return;
                }
            } else {
                if (inputEquality(oldInput, input)) return;
            }
        }

        state = update(input, state);
    };
}
