export type MaybePromise<T> = T|Promise<T>;
export type Depromisify<T> = T extends Promise<infer R> ? R : T;
export type Promisify<T> = T extends Promise<any> ? T : Promise<T>;