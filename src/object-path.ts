const pathParts = Symbol('path parts');

export const anyIndex = Symbol('any') as any;

export type ObjectPathBaseKey = string|symbol|number;

export type ObjectPathSpecialKey<
    T=unknown,
> = {
    anyOf?: T extends unknown ? ObjectPathBaseKey[] : (keyof T)[],
    anyExcept?: T extends unknown ? ObjectPathBaseKey[] : (keyof T)[],
    /**
     * is this item ok, or filter it out?  
     * filtering prevous item in path
     */
    filter?: (item: T) => boolean,
};

export type ObjectPathKey<T=unknown> = (T extends unknown ? ObjectPathBaseKey : keyof T) | ObjectPathSpecialKey<T>;

export type ObjectPathTuple<EndValueT> = (ObjectPathKey[] & { ___endType: EndValueT });

export function objectPathTupleFromArray<EndValueT>(arr: ObjectPathKey[]): ObjectPathTuple<EndValueT> {
    return arr as any;
}

export class ObjectPath<EndValueT> {
    constructor(tuple?: ObjectPathTuple<EndValueT>) {
        this._tuple = tuple || objectPathTupleFromArray([]);
    }

    static from<T extends PathTravelable, EndValueT>(
        o: T,
        pathSpecifier: (o: PathTravel<T, never>) => EndValueT
    ): ObjectPath<EndValueT> {
        return new ObjectPath(pathTupleInObject(o, pathSpecifier));
    }

    readonly _typeof_endType!: EndValueT;
    protected readonly _tuple: ObjectPathTuple<EndValueT>;

    tuple() {
        return this._tuple;
    }

    join<EndValueT2>(pathSpecifier: (o: PathTravel<EndValueT, never>) => EndValueT2) {
        const newPath = joinObjectPath(this._tuple, pathSpecifier);
        return new ObjectPath(newPath);
    }
}

export type PathTravelable = { [k: string]: any } | { [k: number]: any };

type PathTravelPrev = {
    prev: PathTravelPrev|never,
    key: any,
    type: any,
};

type _PathTravelBase<
    T extends PathTravelable,
    Prev extends PathTravelPrev|never = never,
> = {
    [k in keyof T]: T[k] extends PathTravelable ? PathTravel<
        T[k],
        {
            prev: Prev,
            key: k,
            type: T[k],
        }
    > : T[k]
};

type _PathTravelSpecials<
    T extends PathTravelable,
    Prev extends PathTravelPrev|never = never,
> = {
    ____prevType: Prev,
    $anyIndex: PathTravel<T[any]>,
    $keys<K extends keyof T>(keys: K[]): PathTravel<T[K]>;
    $exceptKeys<K extends keyof T>(keys: K[]): PathTravel<T[Exclude<keyof T, K>]>;
    /** filter prevous item in path */
    $filter(filter: (item: T, itemIndex: number, items: T[]) => boolean): PathTravel<T>;
};

export type PathTravel<
    T extends PathTravelable,
    Prev extends PathTravelPrev|never = never,
    _WithSpecials = true
> = _WithSpecials extends false ? _PathTravelBase<T, Prev> : _PathTravelBase<T, Prev> & _PathTravelSpecials<T, Prev>;

export function pathTupleInObject<T extends PathTravelable, EndValueT>(
    o: T,
    pathSpecifier: (o: PathTravel<T, never>) => EndValueT,
    _pathParts?: ObjectPathKey[]
): ObjectPathTuple<EndValueT> {
    let parts: ObjectPathKey[] = _pathParts || [];

    function _pathFromPathProxy(p: any): ObjectPathTuple<any> {
        return p[pathParts];
    }

    const proxy: any = new Proxy({}, {
        get(taget, p) {
            if (p === pathParts) {
                return parts;
            }
            if (p === '$anyIndex') {
                parts.push(anyIndex);
            } else if (p === '$keys') {
                return (keys: string[]) => {
                    parts.push({ anyOf: keys });
                    return proxy;
                };
            } else if (p === '$exceptKeys') {
                return (keys: string[]) => {
                    parts.push({ anyExcept: keys });
                    return proxy;
                };
            } else if (p === '$filter') {
                return (filterFunc: any) => {
                    parts.push({ filter: filterFunc });
                    return proxy;
                };
            } else {
                parts.push(p);
            }
            return proxy;
        },
    });

    return _pathFromPathProxy(pathSpecifier(proxy));
}

export function joinObjectPath<T extends PathTravelable, EndValueT>(
    path: ObjectPathTuple<T>,
    pathSpecifier: (o: PathTravel<T, never>) => EndValueT
): ObjectPathTuple<EndValueT> {
    return pathTupleInObject(undefined!, pathSpecifier, [ ...path ]) as any;
}
