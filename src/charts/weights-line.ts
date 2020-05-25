type WeightParams = {
    pos: number,
    radius: number,
    height: number,
};

type Weight = {
    pos: number,
    radius: number,
    height: number,
    onLineRadius: number,
};

export class WeightsLine {
    readonly length: number = 1;
    readonly wrap: boolean = false;

    /** prevously setted weights from `setWeights` */
    private _weightsCache: Weight[] = [];

    /** wrapped & finalized weights cache */
    protected _weights: Weight[] = [];
    get weights() { return this._weights; }

    setWeights(wps: WeightParams[]) {
        const weights = this._weightsCache = wps.map(w => ({
            ...w,
            onLineRadius: w.radius + w.height,
        }));

        if (this.wrap) {
            const wrapped = [
                ...(weights.map(x => ({ ...x, pos: x.pos - this.length }))),
                ...weights,
                ...(weights.map(x => ({ ...x, pos: x.pos + this.length }))),
            ];
            this._weights = wrapped;
        } else {
            this._weights = weights;
        }
    }

    calcHeight(pos: number) {
        let h = 0;
        for (const w of this.weights) {
            if ((w.pos - w.onLineRadius > pos) && (w.pos - w.radius < pos)) {
                const l = Math.hypot(w.pos - w.onLineRadius, pos);
                h = Math.max(h, l);
            }
            else if ((w.pos - w.radius <= pos) && (w.pos + w.radius >= pos)) {
                h = Math.max(h, w.height);
            }
            else if ((w.pos + w.radius > pos) && (w.pos + w.onLineRadius < pos)) {
                const l = Math.hypot(w.pos + w.radius, pos);
                h = Math.max(h, l);
            }
        }
        return h;
    }
}