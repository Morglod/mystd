interface Array<T> {
    lastItemIndex(): number;
    lastItem(): T|undefined;
    firstItem(): T|undefined;
    toMap<
        MapKey extends keyof T,
    >(mapKey: MapKey | ((item: T, itemIndex: number, array: T[]) => MapKey)): {
        [k in string|number]: T
    },

    sumNumbers<
        K extends keyof T,
        OutT = T[K] extends number ? number : never
    >(key: keyof T): OutT;

    sumNumbers(): T extends number ? number : never;

    minMax<
        K extends keyof T,
        OutT = T[K] extends number ? number : never
    >(key: keyof T): T extends number ? { min: number, max: number } : never;

    minMax(): T extends number ? { min: number, max: number } : never;

    randomItem(): T;
}
