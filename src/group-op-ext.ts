type _PickFuncs<T> = {
    [k in keyof T]: T[k] extends (...args: any) => any ? T[k] : never
};

type GroupOpItems<T> = { length: number, [index: number]: T };

type IfExtends<T, Extends, True> = T extends Extends ? True : {};

type ValueF<GroupT, ValueT> = ValueT | ((g: GroupT) => ValueT);

type GroupOpExtBase<T, ExtBy> = {
    _inplaceMapDeep?: boolean;

    call<
        FuncK extends keyof _PickFuncs<T>,
        _CheckReturn = T[FuncK] extends (...a: any) => any ? ReturnType<T[FuncK]> : never,
    >(
        func: FuncK,
        args: T[FuncK] extends (...a: infer Args) => any ? Args : any[],
    ): GroupOpExtBase<{ item: T, result: _CheckReturn }, ExtBy>;

    call<
        FuncK extends keyof _PickFuncs<T>,
        _CheckReturn = T[FuncK] extends (...a: any) => any ? ReturnType<T[FuncK]> : never,
    >(
        func: FuncK,
        args: T[FuncK] extends (...a: infer Args) => any ? Args : any[],
        then: (results: GroupOpExtBase<{ item: T, result: _CheckReturn }, ExtBy>) => any,
    ): GroupOpExtBase<T, ExtBy>;

    enter<K extends keyof T>(
        enterTo: K
    ): GroupOpExtBase<T[K], ExtBy>;

    enter<K extends keyof T>(
        enterTo: K,
        inside: (g: GroupOpExtBase<T[K], ExtBy>) => any
    ): GroupOpExtBase<T, ExtBy>;

    enter_mapParent<K extends keyof T>(
        enterTo: K
    ): GroupOpExtBase<{ parentGroup: GroupOpExtBase<T, ExtBy>, parent: T, item: T[K] }, ExtBy>;

    enter_mapParent<K extends keyof T>(
        enterTo: K,
        inside: (g: GroupOpExtBase<{ parentGroup: GroupOpExtBase<T, ExtBy>, parent: T, item: T[K] }, ExtBy>) => any
    ): GroupOpExtBase<T, ExtBy>;

    set<K extends keyof T>(
        field: K,
        value: ((item: T, itemIndex: number, items: GroupOpItems<T>, group: GroupOpExtBase<T, ExtBy>) => T[K])
    ): GroupOpExtBase<T, ExtBy>;

    filter(
        filter: ((item: T, itemIndex: number, items: T[], group: GroupOpExtBase<T, ExtBy>) => boolean),
    ): GroupOpExtBase<T, ExtBy>;

    filter(
        filter: ((item: T, itemIndex: number, items: T[], group: GroupOpExtBase<T, ExtBy>) => boolean),
        then: (group: GroupOpExtBase<T, ExtBy>) => any,
    ): GroupOpExtBase<T, ExtBy>;

    map<J>(
        map: ((item: T, itemIndex: number, items: GroupOpItems<T>, group: GroupOpExtBase<T, ExtBy>) => J)
    ): GroupOpExtBase<J, ExtBy>;

    map<J>(
        map: ((item: T, itemIndex: number, items: GroupOpItems<T>, group: GroupOpExtBase<T, ExtBy>) => J),
        then: (g: GroupOpExtBase<J, ExtBy>) => any,
    ): GroupOpExtBase<T, ExtBy>;

    forEach(doItem: (item: T, itemIndex: number, items: GroupOpItems<T>, group: GroupOpExtBase<T, ExtBy>) => void): GroupOpExtBase<T, ExtBy>;

    do<J>(task: (g: GroupOpExtBase<T, ExtBy>, then: (j: GroupOpExtBase<J, ExtBy>) => void) => (GroupOpExtBase<J, ExtBy>|undefined)): GroupOpExtBase<J, ExtBy>;
    do<J>(task: (g: GroupOpExtBase<T, ExtBy>, then: (j: GroupOpExtBase<J, ExtBy>) => void) => (GroupOpExtBase<J, ExtBy>|undefined), then: (g: GroupOpExtBase<J, ExtBy>) => void): GroupOpExtBase<T, ExtBy>;

    doMap<J>(
        task: (g: GroupOpExtBase<T, ExtBy>) => J,
    ): GroupOpExtBase<{ item: T, value: J}, ExtBy>;

    doMap<J>(
        task: (g: GroupOpExtBase<T, ExtBy>) => J,
        then: (g: GroupOpExtBase<{ item: T, value: J}, ExtBy>) => any,
    ): GroupOpExtBase<T, ExtBy>;

    items(): T[];

    itemsRaw(): GroupOpItems<T>;

    itemsRawAsArray(): T[];

    length(): number;

    clone(num: number): GroupOpExtBase<GroupOpExtBase<T, ExtBy>, ExtBy>;
    clone(num: number, then: (g: GroupOpExtBase<GroupOpExtBase<T, ExtBy>, ExtBy>) => void): GroupOpExtBase<T, ExtBy>;

    cloneInside(num: number): GroupOpExtBase<T[], ExtBy>;
    cloneInside(num: number, then: (g: GroupOpExtBase<T[], ExtBy>) => void): GroupOpExtBase<T, ExtBy>;

    cloneFlatten(num: number): GroupOpExtBase<T, ExtBy>;
    cloneFlatten(num: number, then: (g: GroupOpExtBase<T, ExtBy>) => void): GroupOpExtBase<T, ExtBy>;

    pickItem(
        at: number|((item: T, itemIndex: number, items: GroupOpItems<T>, group: GroupOpExtBase<T, ExtBy>) => boolean|number),
    ): T|null;

    pickItem(
        at: number|((item: T, itemIndex: number, items: GroupOpItems<T>, group: GroupOpExtBase<T, ExtBy>) => boolean|number),
        then: (item: T, itemIndex: number, items: GroupOpItems<T>, group: GroupOpExtBase<T, ExtBy>) => void,
    ): GroupOpExtBase<T, ExtBy>;

    /** this will be first, other will be end */
    merge<K>(
        other: GroupOpExtBase<K, ExtBy>,
    ): GroupOpExtBase<T|K, ExtBy>;

    /** this will be first, other will be end */
    merge<K>(
        other: GroupOpExtBase<K, ExtBy>,
        then: (g: GroupOpExtBase<T|K, ExtBy>) => any
    ): GroupOpExtBase<T, ExtBy>
};

type GroupOpExt<T> = GroupOpExtBase<T, {
    pickRange(
        from: ValueF<GroupOpExt<T>, number>,
        to?: ValueF<GroupOpExt<T>, number>,
    ): T[];
    pickRange(
        from: ValueF<GroupOpExt<T>, number>,
        to: ValueF<GroupOpExt<T>, number>|undefined,
        then: (range: T[]) => void,
    ): GroupOpExt<T>;
} & (IfExtends<T, number, {
    sum(): number;
    sum(then: (total: number, g: GroupOpExt<T>) => void): GroupOpExt<T>;
}>)

>;