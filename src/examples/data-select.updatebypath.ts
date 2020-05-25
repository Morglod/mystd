import { updateByPath } from "../data-select";
import { sumNumbers } from "../utils/math";

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

const result = updateByPath(
    testData,
    x => x.children.$anyIndex,
    ctx => ctx.update({
        total: sumNumbers(ctx.g.map(x => x.value).itemsRawAsArray()),
        titleLength: ctx.selectChildren(x => x.title).pickItem(0)!.length
    })
);

console.log(result);