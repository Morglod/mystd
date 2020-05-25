# object-path

```ts
import { ObjectPath, anyIndex } from '../object-path';

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