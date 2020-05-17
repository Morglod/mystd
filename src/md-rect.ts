import { nullObj } from "./utils/base";

type CoordsAny = {
    [coordName: string]: number,
};

// type ItemData<CoordsT extends CoordsAny, DataT> = {
//     pos: CoordsT,
//     data: DataT,
// };

class Rect<CoordsT extends CoordsAny> {
    constructor(
        public readonly min: CoordsT,
        public readonly max: CoordsT,
    ) {}

    private _sizes?: CoordsT;
    sizes() {
        if (this._sizes) return this._sizes;
        const sz: CoordsT = this._sizes = nullObj({}) as any;

        for (const c in this.min) {
            sz[c] = (this.max[c] - this.min[c]) as any;
        }

        return sz;
    }
}

function isPointInRect<CoordsTPoint extends CoordsAny, CoordsTRect extends CoordsAny>(
    point: CoordsTPoint,
    rect: Rect<CoordsTRect>,
    includeBorders?: boolean,
) {
    if (includeBorders) {
        for (const c in rect.min) {
            if (point[c] < rect.min[c]) return false;
        }
        for (const c in rect.max) {
            if (point[c] > rect.max[c]) return false;
        }
    } else {
        for (const c in rect.min) {
            if (point[c] <= rect.min[c]) return false;
        }
        for (const c in rect.max) {
            if (point[c] >= rect.max[c]) return false;
        }
    }

    return true;
}

function isRectOverlapsRect<CoordsTRectA extends CoordsAny, CoordsTRectB extends CoordsAny>(
    rectA: Rect<CoordsTRectA>,
    rectB: Rect<CoordsTRectB>,
    includeBorders?: boolean,
) {
    if (isPointInRect(rectA.min, rectB, includeBorders)) return true;
    if (isPointInRect(rectA.max, rectB, includeBorders)) return true;

    return false;
}
