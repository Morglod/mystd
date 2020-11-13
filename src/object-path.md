# object-path

Example:

```ts
import { ObjectPath } from '../object-path';

const obj = {
    x: {
        y: [
            { z: 1123 },
            { z: 1123 },
            { z: 1123 },
            { z: 1123 },
            { d: 1123 },
            { t: 1123 },
            { s: 1123 },
        ]
    },
    bb: {
        ll: 'qweqweqwe'
    }
}

const pathTuple = ObjectPath.from(obj, o => o.x.y.$anyIndex.s);

console.log(pathTuple);
```

Output:
```
ObjectPath { _tuple: [ 'x', 'y', Symbol(any), 's' ] }
```

# API

## Specify path

`ObjectPath.from(someObject, path)`

`path` is callback with chain of fields or special keys

Special keys are:
* `$anyIndex` - for any key
* `$keys(keys[])` - for one of specified keys
* `$exceptKeys(keys[])` - any, except specified
* `$filter(filter)` - selector with items filter

$filter signature:
```ts
(item: T, itemIndex: number, items: T[]) => boolean
```

## Access to path tuple

```ts
const path = ObjectPath.from({ a: [ 123 ] }, o => o.a.$anyIndex);

path.tuple(); // [ 'a', anyIndex symbol ];
```

## Join/Extend/Append path

```ts
// path to { b: 123 }
const path = ObjectPath.from({ a: [ { b: 123 } ] }, o => o.a.$anyIndex);

// path to 'b'
const pathToB = path.join(o => o.b);
```

## Type of item by path

```ts
// path to { b: 123 }
const path = ObjectPath.from({ a: [ { b: 123 } ] }, o => o.a.$anyIndex);

let b: typeof path._typeof_endType;
```
