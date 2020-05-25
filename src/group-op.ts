type _PickFuncs<T> = {
    [k in keyof T]: T[k] extends (...args: any) => any ? T[k] : never
};

export type GroupOpItems<T> = { length: number, [index: number]: T };

export class GroupOp<T> {
    constructor(
        items: GroupOpItems<T>
    ) {
        this._items = items;
    }

    static isGroup(o: any): o is GroupOp<any> {
        return o instanceof GroupOp;
    }

    protected _items: GroupOpItems<T>;
    _inplaceMapDeep?: boolean;

    call<
        FuncK extends keyof _PickFuncs<T>,
        _CheckReturn = T[FuncK] extends (...a: any) => any ? ReturnType<T[FuncK]> : never,
    >(
        func: FuncK,
        args: T[FuncK] extends (...a: infer Args) => any ? Args : any[],
    ): GroupOp<{ item: T, result: _CheckReturn }>;

    call<
        FuncK extends keyof _PickFuncs<T>,
        _CheckReturn = T[FuncK] extends (...a: any) => any ? ReturnType<T[FuncK]> : never,
    >(
        func: FuncK,
        args: T[FuncK] extends (...a: infer Args) => any ? Args : any[],
        then: (results: GroupOp<{ item: T, result: _CheckReturn }>) => any,
    ): GroupOp<T>;

    call<
        FuncK extends keyof _PickFuncs<T>,
        _CheckReturn = T[FuncK] extends (...a: any) => any ? ReturnType<T[FuncK]> : never,
    >(
        func: FuncK,
        args: T[FuncK] extends (...a: infer Args) => any ? Args : any[],
        then?: (results: GroupOp<{ item: T, result: _CheckReturn }>) => any,
    ) {
        const results = new Array(this._items.length);
        for (let i = 0; i < this._items.length; ++i) {
            results[i] = {
                result: ((this._items[i] as any)[func] as Function).apply(
                    this._items[i],
                    typeof args === 'function' ? (args as any)(this._items[i], i, this._items, this) : args,
                ),
                item: this._items[i],
            };
        }
        if (then) {
            then(new GroupOp(results));
            return this;
        } else {
            return new GroupOp(results);
        }
    }

    enter<K extends keyof T>(
        enterTo: K
    ): GroupOp<T[K]>;

    enter<K extends keyof T>(
        enterTo: K,
        inside: (g: GroupOp<T[K]>) => any
    ): GroupOp<T>;

    enter<K extends keyof T>(
        enterTo: K,
        inside?: (g: GroupOp<T[K]>) => any
    ) {
        const mapper = (item: T): T[K] => item[enterTo];
        
        if (inside) {
            return this.map(mapper, inside);
        } else {
            return this.map(mapper);
        }
    }

    enter_mapParent<K extends keyof T>(
        enterTo: K
    ): GroupOp<{ parentGroup: GroupOp<T>, parent: T, item: T[K] }>;

    enter_mapParent<K extends keyof T>(
        enterTo: K,
        inside: (g: GroupOp<{ parentGroup: GroupOp<T>, parent: T, item: T[K] }>) => any
    ): GroupOp<T>;

    enter_mapParent<K extends keyof T>(
        enterTo: K,
        inside?: (g: GroupOp<{ parentGroup: GroupOp<T>, parent: T, item: T[K] }>) => any
    ) {
        const mapper = (item: T): { parentGroup: GroupOp<T>, parent: T, item: T[K] } => ({
            parent: item,
            parentGroup: this,
            item: item[enterTo],
        });
        
        if (inside) {
            return this.map(mapper, inside);
        } else {
            return this.map(mapper);
        }
    }

    set<K extends keyof T>(
        field: K,
        value: ((item: T, itemIndex: number, items: GroupOpItems<T>, group: GroupOp<T>) => T[K])
    ): GroupOp<T> {
        for (let i = 0; i < this._items.length; ++i) {
            this._items[i][field] = value(this._items[i], i, this._items, this);
        }
        return this;
    }

    filter(
        filter: ((item: T, itemIndex: number, items: T[], group: GroupOp<T>) => boolean),
    ): GroupOp<T>;

    filter(
        filter: ((item: T, itemIndex: number, items: T[], group: GroupOp<T>) => boolean),
        then: (group: GroupOp<T>) => any,
    ): GroupOp<T>;

    filter(
        filter: ((item: T, itemIndex: number, items: T[], group: GroupOp<T>) => boolean),
        then?: (group: GroupOp<T>) => any,
    ) {
        const filtered = new GroupOp(Array.from(this._items).filter((v,i,a) => filter(v,i,a,this)));
        if (then) {
            then(filtered);
        } else {
            return filtered;
        }
    }

    map<J>(
        map: ((item: T, itemIndex: number, items: GroupOpItems<T>, group: GroupOp<T>) => J)
    ): GroupOp<J>;

    map<J>(
        map: ((item: T, itemIndex: number, items: GroupOpItems<T>, group: GroupOp<T>) => J),
        then: (g: GroupOp<J>) => any,
    ): GroupOp<T>;

    map<J>(
        map: ((item: T, itemIndex: number, items: GroupOpItems<T>, group: GroupOp<T>) => J),
        then?: (g: GroupOp<J>) => any,
    ) {
        const results = this._inplaceMapDeep ? this._items : new Array(this._items.length);
        for (let i = 0; i < this._items.length; ++i) {
            results[i] = map(this._items[i], i, this._items, this);
        }
        if (then) {
            then(this._inplaceMapDeep ? this : new GroupOp(results));
            return this;
        } else {
            return this._inplaceMapDeep ? this : new GroupOp(results);
        }
    }

    forEach(doItem: (item: T, itemIndex: number, items: GroupOpItems<T>, group: GroupOp<T>) => void) {
        for (let i = 0; i < this._items.length; ++i) {
            doItem(this._items[i], i, this._items, this);
        }
        return this;
    }

    do<J>(task: (g: GroupOp<T>, then: (j: GroupOp<J>) => void) => (GroupOp<J>|undefined)): GroupOp<J>;
    do<J>(task: (g: GroupOp<T>, then: (j: GroupOp<J>) => void) => (GroupOp<J>|undefined), then: (g: GroupOp<J>) => void): GroupOp<T>;

    do<J>(task: (g: GroupOp<T>, then: (j: GroupOp<J>) => void) => (GroupOp<J>|undefined), then?: (g: GroupOp<T>) => void): unknown {
        let j: GroupOp<J>|undefined = undefined;

        const j3 = task(this, j2 => {
            j = j2;
        });

        if (!j) j = j3!;

        if (then) {
            then(j as any);
            return this;
        } else {
            return j;
        }
    }

    doMap<J>(
        task: (g: GroupOp<T>) => J,
    ): GroupOp<{ item: T, value: J}>;

    doMap<J>(
        task: (g: GroupOp<T>) => J,
        then: (g: GroupOp<{ item: T, value: J}>) => any,
    ): GroupOp<T>;

    doMap<J>(
        task: (g: GroupOp<T>) => J,
        then?: (g: GroupOp<{ item: T, value: J}>) => any,
    ) {
        const j = task(this);
        const mapper = (item: T) => ({
            item,
            value: j,
        });
        return then ? this.map(mapper, then) : this.map(mapper);
    }

    items(): T[] {
        return Array.from(this._items);
    }

    itemsRaw() {
        return this._items;
    }

    itemsRawAsArray(): T[] {
        return Array.isArray(this._items) ? this._items : Array.from(this._items);
    }

    length() {
        return this._items.length;
    }

    clone(num: number): GroupOp<GroupOp<T>>;
    clone(num: number, then: (g: GroupOp<GroupOp<T>>) => void): GroupOp<T>;

    clone(num: number, then?: (g: GroupOp<GroupOp<T>>) => void): unknown {
        const clones = Array.from({ length: num }) as GroupOp<T>[];
        for (let i = 0; i < num; ++i) {
            clones[i] = new GroupOp(Array.from(this._items));
        }

        if (then) {
            then(new GroupOp(clones));
            return this;
        } else {
            return new GroupOp(clones);
        }
    }

    cloneInside(num: number): GroupOp<T[]>;
    cloneInside(num: number, then: (g: GroupOp<T[]>) => void): GroupOp<T>;

    cloneInside(num: number, then?: (g: GroupOp<T[]>) => void): unknown {
        const clones = Array.from({ length: this._items.length }) as T[][];
        for (let i = 0; i < this._items.length; ++i) {
            clones[i] = Array.from({ length: num });
            for (let j = 0; j < num; ++j) {
                clones[i][j] = this._items[i];
            }
        }

        if (then) {
            then(new GroupOp(clones));
            return this;
        } else {
            return new GroupOp(clones);
        }
    }

    cloneFlatten(num: number): GroupOp<T>;
    cloneFlatten(num: number, then: (g: GroupOp<T>) => void): GroupOp<T>;

    cloneFlatten(num: number, then?: (g: GroupOp<T>) => void): unknown {
        const clones = Array.from({ length: this._items.length * num }) as T[];

        for (let i = 0; i < this._items.length * num; ++i) {
            clones[i] = this._items[i % this._items.length];
        }

        if (then) {
            then(new GroupOp(clones));
            return this;
        } else {
            return new GroupOp(clones);
        }
    }

    pickItem(
        at: number|((item: T, itemIndex: number, items: GroupOpItems<T>, group: GroupOp<T>) => boolean|number),
    ): T|null;

    pickItem(
        at: number|((item: T, itemIndex: number, items: GroupOpItems<T>, group: GroupOp<T>) => boolean|number),
        then: (item: T, itemIndex: number, items: GroupOpItems<T>, group: GroupOp<T>) => void,
    ): GroupOp<T>;

    pickItem(
        at: number|((item: T, itemIndex: number, items: GroupOpItems<T>, group: GroupOp<T>) => boolean|number),
        then?: (item: T, itemIndex: number, items: GroupOpItems<T>, group: GroupOp<T>) => void,
    ): unknown {
        let ind;

        if (typeof at === 'number') ind = at;
        else {
            loop: for (let i = 0; i < this._items.length; ++i) {
                const r = at(this._items[i], i, this._items, this);
                if (typeof r === 'number') {
                    ind = r;
                    break loop;
                }
                if (r === true) {
                    ind = i;
                    break loop;
                }
            }
        }

        if (then) {
            if (ind !== undefined) {
                then(this._items[ind], ind, this._items, this);
            }
            return this;
        } else {
            if (ind !== undefined) {
                return (this._items[ind]);
            }
            return null;
        }
    }

    /** this will be first, other will be end */
    merge<
        K,
    >(
        other: GroupOp<K>,
        then?: (g: GroupOp<T|K>) => any
    ): typeof then extends undefined ? GroupOp<T|K> : GroupOp<T> {
        const newItems = Array.from(this._items).concat(...other.items() as any as T[]) as (T|K)[];
        if (then) {
            then(new GroupOp(newItems));
            return this;
        } else {
            return new GroupOp(newItems) as any;
        }
    }
}

export function groupOf<T>(items: GroupOpItems<T>): GroupOp<T> {
    return new GroupOp(items);
}

export function queryGroup<K extends keyof HTMLElementTagNameMap>(selector: string, parent?: Element): GroupOp<HTMLElementTagNameMap[K]>;
export function queryGroup<K extends keyof SVGElementTagNameMap>(selector: string, parent?: Element): GroupOp<SVGElementTagNameMap[K]>;
export function queryGroup<E extends Element = Element>(selector: string, parent?: Element): GroupOp<E>;

export function queryGroup<ResultEl extends Element = Element>(selector: string, parent?: Element): GroupOp<ResultEl> {
    const nodes = (parent || document).querySelectorAll<ResultEl>(selector);
    return new GroupOp(nodes);
}

export function mergeGroups<T>(g: GroupOp<T>[]): GroupOp<T> {
    return g.reduce((sum, x) => sum ? sum.merge(x) : x);
}

export function flattenMergeGroups<T>(g: GroupOp<GroupOp<T>[]>): GroupOp<T> {
    const ar = g.itemsRawAsArray();
    let firstG = ar[0][0];

    for (let j = 0; j < ar.length; ++j) {
        for (let i = 1; i < ar[j].length; ++i) {
            firstG = firstG.merge(ar[j][i]);
        }
    }

    return firstG;
}

export function isGroup(o: any): o is GroupOp<any> {
    return o instanceof GroupOp;
}