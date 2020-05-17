import 'regenerator-runtime/runtime'; // for parcel

import { queryGroup, groupOf } from '../../group-op';
import { sleep } from '../../utils/async';
import { memoizeKeys } from '../../memo';
import { scalarsOfGroup, minMaxOfArray } from '../../utils/math';

(async () => {
    const initialItems = [ 1, 2, 3, 4, 5, 6, 7, 8, 9 ];

    const renderItems = memoizeKeys<
        number[],
        { name: string, value: number, d: HTMLDivElement },
        { items: number[], maxColorR: number, maxValue: number }
    >(
        (value, index, inp) => {
            const d = document.createElement('div');
            d.className = 'item';
            d.innerText = `Item ${index}`;
            d.style.width = `${value * 50}px`;
            d.style.backgroundColor = `rgb(${(value / inp.maxValue * inp.maxColorR)},100,100)`;
            d.style.borderBottom = '1px solid red';
            document.body.appendChild(d);

            return {
                name: `Item ${index}`,
                value,
                d
            };
        },
        (newValue, k, x, inp) => {
            x.d.style.width = `${newValue * 50}px`;
            x.d.style.backgroundColor = `rgb(${(newValue / inp.maxValue * inp.maxColorR)},100,100)`;
            return x;
        },
        (x) => {
            x.d.remove();
        },
        undefined,
        inp => inp.items,
    );

    while (true) {
        await sleep(1000);
        const newData = initialItems.map(x => Math.random() * x);

        if (Math.random() > 0.4) {
            newData.push(Math.random() * 9, Math.random() * 9);
        }

        const { max } = minMaxOfArray(newData);
        renderItems({ items: newData, maxColorR: 200, maxValue: max });
    }
})();
