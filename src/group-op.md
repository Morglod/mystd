# `GroupOp<T>`

Group operations on any dataset  
Used in `data-select.ts`

Very similar to d3's selector.

## Create

From ArrayLike with ctor:
```ts
const items = [ 1, 2, 3 ];
const group = new GroupOp(items);
```

From ArrayLike with func:
```ts
const items = [ 1, 2, 3 ];
const group = groupOf(items);
```

From DOM:
```ts
const group = queryGroup('.cards > .title');
```

Check is group?
```ts
isGroup(maybeGroup);
```

## Merge groups

```ts
const groupA: GroupOp<Item>;
const groupB: GroupOp<Item>;

const merged = mergeGroups([ groupA, groupB ]);

const merged = flattenMergeGroups(
    groupOf([
        [ groupA, groupB ]
    ])
);

const merged = groupA.merge(groupB);
```

## Call method on every item

```ts

interface Item {
    info(arg: boolean): string;
}

const group: GroupOp<Item>;
const resultGroup = group.call('info', [ true ]);

```

## Walk inside field of each item

```ts
interface Item {
    pos: { x: number, y: number };
}

const group: GroupOp<Item>;

const posGroup: GroupOp<{ x: number, y: number }> = group.enter('pos');
```

```ts
interface Item {
    pos: { x: number, y: number };
}

const group: GroupOp<Item>;

const posGroup: GroupOp<{
    parentGroup: GroupOp<Item>,
    parent: Item,
    item: { x: number, y: number }
}> = group.enter_mapParent('pos');
```

## Set fields of all items

```ts
interface Item {
    pos: { x: number, y: number };
}

const group: GroupOp<Item>;

group
    .enter('pos')
    .set('x', (item, itemIndex) => {
        itemIndex + 10
    })
;
```

## Filter out items from group

```ts
interface Item {
    pos: { x: number, y: number };
}

const group: GroupOp<Item>;

group
    .filter(item => {
        return item.pos.x > 0;
    })
;
```

## Map items to other items

```ts
interface ItemA {
    pos: { x: number, y: number };
}

interface ItemB {
    pos: string;
}

const groupA: GroupOp<ItemA>;

const groupB: GroupOp<ItemB> = groupA
    .map(item => {
        return { pos: `${item.pos.x}x${item.pos.y}` };
    })
;
```

## Walk over items

```ts
interface Item {
    pos: { x: number, y: number };
}

const group: GroupOp<Item>;

group
    .forEach(item => {
        return console.log(item)
    })
;
```

## Do/Then

```ts
interface Item {
    pos: { x: number, y: number };
}

const group: GroupOp<Item>;

const groupPos: GroupOp<{ x: number, y: number }> = group
    .do((group, then) => {
        then(group.enter('pos'))
    })
;
```

## Get items

```ts
interface Item {
    pos: { x: number, y: number };
}

const group: GroupOp<Item>;

// Cloned array
const items = group.items();

// reference to container from ctor
const itemsRef = group.itemsRaw();

// reference to container from ctor or cloned if was not array
const itemsRefAsArray = group.itemsRawAsArray();

// items.length
const itemsCount = group.length();
```

### Pick item

```ts
group.pickItem(10);

group.pickItem(item => item.type === 'required');
```

## Clone group

```ts
const times = 3;

GroupOp {
    GroupOp, GroupOp, GroupOp
} = group.clone(3);
```

`cloneInside`, `cloneFlatten`