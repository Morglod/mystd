import { ObjectPathTuple, anyIndex, _pathTupleInObject, _joinObjectPathTuple, PathTravelable, _PathTravel, ObjectPathKey, ObjectPathSpecialKey, ObjectPath } from './object-path';
import { GroupOp, groupOf, flattenMergeGroups, isGroup } from './group-op';

function travelPathTuplePart<T>(obj: GroupOp<T>, nextField: ObjectPathKey, withParents: 'withParents'): GroupOp<{
    parentGroup: GroupOp<T>;
    parent: T;
    item: any;
}>;
function travelPathTuplePart<T>(obj: GroupOp<T>, nextField: ObjectPathKey, withParents?: false): GroupOp<any>;
function travelPathTuplePart<T>(obj: GroupOp<T>, nextField: ObjectPathKey, withParents?: false|'withParents') {
    if (typeof nextField === 'symbol' || typeof nextField === 'object') {
        const goToKeys = (keyPicker: (item: any) => any[]) => flattenMergeGroups(
            obj.map(
                item => keyPicker(item).map(k => {
                    const ge = groupOf([ item ]);
                    ge._inplaceMapDeep = true;
                    return travelPathTuplePart(ge, k as any);
                })
            )
        );

        if (nextField === anyIndex) {
            return goToKeys(item => Object.keys(item));
        } else if ((nextField as any).anyOf) {
            return goToKeys(item => {
                return Object.keys(item).filter(k => (nextField as any).anyOf.includes(k));
            });
        } else if ((nextField as any).anyExcept) {
            return goToKeys(item => {
                return Object.keys(item).filter(k => !(nextField as any).anyExcept.includes(k));
            });
        } else if ((nextField as any).filter) {
            return obj.filter((item, itemIndex, items) => {
                return (nextField as any).filter(item, itemIndex, items);
            });
        } else {
            throw new Error('unknown symbl in travelPathPart (data-select)');
        }
    }

    if (withParents) {
        return obj.enter_mapParent(nextField as keyof T);
    }
    return obj.enter(nextField as keyof T);
}

export function travelPathTuple<T, TP extends ObjectPathTuple<any>>(obj: T, path: TP, withParents?: false): GroupOp<TP["___endType"]>;
export function travelPathTuple<T, TP extends ObjectPathTuple<any>>(obj: T, path: TP, withParents: 'withParents'): GroupOp<{
    parentGroup: GroupOp<any>
    parent: any;
    item: TP["___endType"];
}>;
export function travelPathTuple<T, TP extends ObjectPathTuple<any>>(obj: T, path: TP, withParents?: false|'withParents') {
    let g: GroupOp<any> = groupOf([ obj ]);
    g._inplaceMapDeep = true;
    
    for (let i = 0; i < path.length; ++i) {
        if (i < path.length - 1) {
            g = travelPathTuplePart(g, path[i]);
        } else {
            g = travelPathTuplePart(g, path[i], withParents as any);
        }
    }

    return g;
}

export function travelPath<T, TP extends ObjectPath<any>>(obj: T, path: TP, withParents?: false): GroupOp<TP["_typeof_endType"]>;
export function travelPath<T, TP extends ObjectPath<any>>(obj: T, path: TP, withParents: 'withParents'): GroupOp<{
    parentGroup: GroupOp<any>
    parent: any;
    item: TP["_typeof_endType"];
}>;
export function travelPath<T, TP extends ObjectPath<any>>(obj: T, path: TP, withParents?: false|'withParents') {
    return travelPathTuple(obj, path.tuple(), withParents as any);
}

export function selectPath<T extends PathTravelable, EndValueT>(obj: T, pathSpecifier: (o: _PathTravel<T, never>) => EndValueT, withParents?: false): GroupOp<EndValueT>;
export function selectPath<T extends PathTravelable, EndValueT>(obj: T, pathSpecifier: (o: _PathTravel<T, never>) => EndValueT, withParents: 'withParents'): GroupOp<{
    parentGroup: GroupOp<any>
    parent: any;
    item: EndValueT;
}>;
export function selectPath<T extends PathTravelable, EndValueT>(obj: T, pathObject: ObjectPath<EndValueT>, withParents?: false): GroupOp<EndValueT>;
export function selectPath<T extends PathTravelable, EndValueT>(obj: T, pathObject: ObjectPath<EndValueT>, withParents: 'withParents'): GroupOp<{
    parentGroup: GroupOp<any>
    parent: any;
    item: EndValueT;
}>;
export function selectPath<T extends PathTravelable, EndValueT>(
    obj: T,
    pathSpecifier_pathObject: ((o: _PathTravel<T, never>) => EndValueT)|ObjectPath<EndValueT>,
    withParents?: false|'withParents'
) {
    const tuple = typeof pathSpecifier_pathObject === 'function' ? _pathTupleInObject(obj, pathSpecifier_pathObject) : pathSpecifier_pathObject.tuple();
    return travelPathTuple(obj, tuple, withParents as any);
}

export function spreadOnFields<T extends {
    [k: string]: any|GroupOp<any>|ObjectPath<any>,
}>(o: T): ({
    [k in keyof T]: T[k] extends GroupOp<infer GT> ? GT : T[k]
})[] {
    /** max group size will be used as total items */
    let maxGroupSize = 0;

    for (const k in o) {
        const x = o[k] as any;
        if (isGroup(x)) {
            maxGroupSize = Math.max(maxGroupSize, x.length());
        }
    }

    const items = [] as ({
        [k in keyof T]: T[k] extends GroupOp<infer GT> ? GT : T[k]
    })[];

    for (let i = 0; i < maxGroupSize; ++i) {
        const item = {} as any;
        
        for (const k in o) {
            const x = o[k] as any;
            if (isGroup(x)) {
                item[k] = x.itemsRawAsArray()[i];
            } else {
                item[k] = o[k];
            }
        }

        items.push(item);
    }

    return items;
}

type UpdateByPathUpdater_Commit<EndValueT> = {
    [k in keyof Partial<EndValueT>]: (
        EndValueT[k] |
        GroupOp<EndValueT[k]>
    )
} & {
    [k2: string]: (
        any |
        GroupOp<any>
    )
};

type UpdateByPathUpdater<ParentT, EndValueT, NewT> = (ctx: {
    g: GroupOp<EndValueT>,
    item: EndValueT,
    itemUpdateIndex: number,
    update: (commit: UpdateByPathUpdater_Commit<EndValueT & NewT>) => void,
    path: ObjectPath<EndValueT>,
    selectChildren: <EndValueT2>(pathSpecifier: (o: _PathTravel<EndValueT, never>) => EndValueT2) => GroupOp<EndValueT2>,
}) => void;

export function updateByPath<T extends PathTravelable, EndValueT, NewT>(obj: T, pathSpecifier: (o: _PathTravel<T, never>) => EndValueT, updater: UpdateByPathUpdater<any, EndValueT, NewT>): GroupOp<EndValueT & NewT>;
export function updateByPath<T extends PathTravelable, EndValueT, NewT>(obj: T, pathObject: ObjectPath<EndValueT>, updater: UpdateByPathUpdater<any, EndValueT, NewT>): GroupOp<EndValueT & NewT>;

export function updateByPath<T extends PathTravelable, EndValueT, NewT>(obj: T, pathObject_pathSpecifier: ((o: _PathTravel<T, never>) => EndValueT) | ObjectPath<EndValueT>, updater: UpdateByPathUpdater<any, EndValueT, NewT>) {
    const objPath = typeof pathObject_pathSpecifier === 'function' ? ObjectPath.from(obj, pathObject_pathSpecifier) : pathObject_pathSpecifier;
    const selectedObj = selectPath(obj, objPath) as GroupOp<EndValueT>;

    selectedObj.forEach((item, itemIndex, gItems, g) => {
        const ctx = {
            item,
            g,
            itemUpdateIndex: itemIndex,
            path: objPath,
            selectChildren: (pathSpecifier: any) => selectPath(item, pathSpecifier) as any,
            update: (partialCommit: UpdateByPathUpdater_Commit<EndValueT>) => {
                for (const k in partialCommit) {
                    if (GroupOp.isGroup(partialCommit[k])) {
                        (item as any)[k] = (partialCommit[k] as GroupOp<any>).pickItem(itemIndex);
                    } else {
                        (item as any)[k] = partialCommit[k];
                    }
                }
            }
        };

        updater(ctx);
    });

    return selectedObj as any;
}