Utils for in-dataset work  
Similar to d3's selectors but for JSONs

```ts
import { sumNumbers, scalarsOfGroup } from "../utils/math";
import { selectPath, spreadOnFields } from "../data-select";
import { ObjectPath } from "../object-path";
import { groupOf } from "../group-op";

const testData = {
    name: 'hello',
    children: [
        { value: 10, title: 'qwewe 1' },
        { value: 20, title: 'qwewe 2' },
        { value: 30, title: 'qwewe 3' },
        { value: 40, title: 'qwewe 4' },
        { value: 50, title: 'aaaa' },
    ]
};

const testData2 = {
    ...testData,
    total: sumNumbers(
        selectPath(testData, x => x.children.$anyIndex.value).items()
    ),
};

console.log(testData2);

const itemSelector = ObjectPath.from(testData, x => x.children.$anyIndex);
const itemTitleSelector = itemSelector.join(x => x.title);
const itemValueSelector = itemSelector.join(x => x.value);

console.log(
    spreadOnFields({
        title: selectPath(testData, itemTitleSelector),
        value: selectPath(testData, itemValueSelector),
        r: groupOf(scalarsOfGroup(
            selectPath(testData, itemValueSelector).itemsRawAsArray()
        ))
    })
)

console.log(testData);
selectPath(testData, x => x).forEach((data) => {
    data.children = spreadOnFields({
        title: selectPath(testData, itemTitleSelector),
        value: selectPath(testData, itemValueSelector),
        r: groupOf(scalarsOfGroup(
            selectPath(testData, itemValueSelector).itemsRawAsArray()
        ))
    }) as any
})

console.log('---');

console.log(testData);
console.log('---');

console.log(
    selectPath(
        testData,
        x => x.children.$anyIndex.$filter(item => item.title.startsWith('qwe'))
    ).itemsRawAsArray()
)
```