
export function scalarsOfGroup(group: number[], base: number = 1, maxDiff?: number): number[] {
    const max = Math.max(...group);

    return group.map(x => {
        let diff = x / max;
        if (maxDiff !== undefined && diff <= maxDiff) {
            diff = maxDiff;
        }
        return diff * base;
    });
}


export function minMaxInArray<T extends { [x in ValueKey]?: number }, ValueKey extends string = 'value'>(
    items: T[],
    valueKey: ValueKey = 'value' as any
): { min: number, max: number } {
    if (items.length === 0) {
        return { min: 0, max: 0 };
    }

    let min = Number.MAX_SAFE_INTEGER;
    let max = Number.MIN_SAFE_INTEGER;

    for (const item of items) {
        if (item[valueKey]) {
            min = Math.min(item[valueKey]!, min);
            max = Math.max(item[valueKey]!, max);
        }
    }

    return { min, max };
}

export function minMaxOfArray(items: number[]): { min: number, max: number } {
    if (items.length === 0) {
        return { min: 0, max: 0 };
    }

    let min = Number.MAX_SAFE_INTEGER;
    let max = Number.MIN_SAFE_INTEGER;

    for (const item of items) {
        min = Math.min(item, min);
        max = Math.max(item, max);
    }

    return { min, max };
}

export function sumNumbers(items: number[]): number {
    let result = 0;
    for (const x of items) {
        result += x;
    }
    return result;
}