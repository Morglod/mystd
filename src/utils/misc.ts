export function assertDefined<T>(x: T|undefined|null): T {
    if (x === undefined || x === null) {
        throw new Error('should not be undefined')
    }
    return x;
}
  
export function unsafeFastUid() {
    return Math.floor(Math.random() * 9999).toString(16) + '_' + Math.floor(Math.random() * 9999).toString(16) + '_'  + Math.floor(Math.random() * 9999).toString(16);
}