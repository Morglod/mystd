/** Json pod type */
export type Json =
  | null
  | boolean
  | number
  | string
  | Json[]
  | { [prop: string]: Json }
;

/** 
 * Type checking for Json
 * 
 * ```ts
 * function test<T extends JsonCompatible<T>>(json: T): T {
 *   return null as any;
 * }
 * ```
 * 
 * from `osi-oswald` https://github.com/microsoft/TypeScript/issues/1897#issuecomment-580962081
 */
export type JsonCompatible<T> = {
  [P in keyof T]: T[P] extends Json
    ? T[P]
    : Pick<T, P> extends Required<Pick<T, P>>
    ? never
    : T[P] extends (() => any) | undefined
    ? never
    : JsonCompatible<T[P]>;
};

/**
 * nullify objects proto
 * 
 * this will make fields access much faster  
 * userful for maps/dictionaries
 * 
 * check `https://github.com/Morglod/tseep` benchmark
 */
export function nullObj<T = any>(x?: T): T {
    if (!x) x = {} as any;
    (x as any).__proto__ = null;
    return x as any;
}

export type ProtoNull = {
    readonly __proto__?: null,
};
