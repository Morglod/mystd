# `@Singletone()`

From:
```ts
export class DataManager {
    static private _instance: DataManager;
    static get instance() {
        if (!DataManager._instance) DataManager._instance = new DataManager;
        return DataManager._instance;
    }
} 
```

To:
```ts
import { Singletone } from "utils/singletone";

@Singletone()
export class DataManager {
    static instance: DataManager;
} 
```