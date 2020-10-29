/**
 * 
 * Example:
 * 
 * ```ts
 * import { Singletone } from "utils/singletone";
 * 
 * @Singletone()
 * export class DataLoaderManager {
 *     static instance: DataLoaderManager;
 * } 
 * ```
 */
export function Singletone<T extends {
    new (...args: any): any

    instance: InstanceType<T>
}>(params: (
    // create new instance params (args or create func)
    (ConstructorParameters<T> extends [] ? ({
        args: ConstructorParameters<T>
    } | {
        create: () => T
    }) : {}) &
    
    // other misc params
    {
        /** can set Class.instance */
        mutable?: boolean,
        beforeSet?: (val: any) => T,
    }
) = {} as any) {
    return function(classDef: T) {
        let _instance: InstanceType<T> = undefined!;

        const propParams: PropertyDescriptor = {
            get() {
                if (_instance === undefined) {
                    if ((params as any).args !== undefined) {
                        _instance = new classDef(...((params as any).args as any));
                    }
                    else if ((params as any).create !== undefined) {
                        _instance = (params as any).create();
                    }
                    else {
                        _instance = new classDef();
                    }
                }
                return _instance;
            }
        };

        if (params.mutable === true) {
            propParams.set = (val: any) => {
                if (params.beforeSet !== undefined) val = params.beforeSet(val);
                _instance = val;
            };
        }
    
        Object.defineProperty(classDef, 'instance', propParams);

        return classDef;
    }
}