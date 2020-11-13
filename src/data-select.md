Utils for in-dataset work

Example:

```ts
import { sumNumbers, scalarsOfGroup } from "../utils/math";
import { selectPath, spreadOnFields } from "../data-select";
import { ObjectPath } from "../object-path";
import { groupOf } from "../group-op";

// We have some dataset
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

// Calculate total of children.value and save it as 'total' field
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

// Append 'r' field to children
// r shoulde be radius calculated as [value / maximum value]
const newChildren = spreadOnFields({
    title: selectPath(testData, itemTitleSelector),
    value: selectPath(testData, itemValueSelector),
    r: groupOf(scalarsOfGroup(
        selectPath(testData, itemValueSelector).itemsRawAsArray()
    ))
});

// newChildren is type of {
//     title: string,
//     value: number,
//     r: number,
// }[]

// Pick items from children which title startsWith('qwe')
console.log(
    selectPath(
        testData,
        x => x.children.$anyIndex.$filter(item => item.title.startsWith('qwe'))
    ).itemsRawAsArray()
)
```
