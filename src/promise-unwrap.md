# `promiseUnwrap<T>()`

## Example

From:
```ts
function fsGetFile(fs: FileSystem, path: string, flags: Parameters<DirectoryEntry["getFile"]>[1]) {
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
function fsGetFile(fs: FileSystem, path: string, flags: Parameters<DirectoryEntry["getFile"]>[1]) {
    const x = promiseUnwrap<FileEntry>();
    fs.root.getFile(path, flags, x.resolve, x.reject);
    return x.promise;
}
```
