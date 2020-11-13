# `promiseUnwrap<T>()`

returns
```ts
{
    resolve: (x: T) => void,
    reject: (reason?: any) => any,
    promise: Promise<T>
}
```

## Example

From:
```ts
function fsGetFile(fs: FileSystem, path: string, flags: any) {
    return new Promise((resolve, reject) => {
        fs.root.getFile(path, flags,
            fsEntry => resolve(fsEntry),
            fsError => reject(fsError),
        );
    })
}
```

To:
```ts
function fsGetFile(fs: FileSystem, path: string, flags: any) {
    const x = promiseUnwrap<FileEntry>();
    fs.root.getFile(path, flags, x.resolve, x.reject);
    return x.promise;
}
```
