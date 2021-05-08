import { assert } from "./assert";
import { jsonHash } from "./json-hash";

const a = { a: 1 };
const a2 = { a: 1 };
const c = { b: 1 };
const d = { a: 2 };
const e = { a: 2, g: [ 'qweqwe', 123, { aa: 123 } ] };
const f = { a: { b: { c: { d: { e: 'qweqweqwe' }}}} };

(() => {
    assert(() => jsonHash(a) === jsonHash(a));
    assert(() => jsonHash(a) === jsonHash(a2));
    assert(() => jsonHash(a) !== jsonHash(c));
    assert(() => jsonHash(a) !== jsonHash(d));
    assert(() => jsonHash(e) !== jsonHash(f));
})();