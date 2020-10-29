import { promiseUnwrap, PromiseUnwrap } from "./promise-unwrap";

export class PromiseQueue<T = any> {
    push(x: T) {
        const pend = this._pending.shift();
        if (pend) {
            pend.resolve(x);
        } else {
            this._queue.push(x);
        }
    }

    async pop(): Promise<T> {
        const found = this._queue.shift();
        if (found !== undefined) return found;

        const pending = promiseUnwrap<T>();
        this._pending.push(pending);

        return pending.promise;
    }

    async popBuffer(sz: number): Promise<T[]> {
        return Promise.all(Array.from({ length: sz }).map(_ => this.pop()));
    }

    _queue: T[] = [];
    _pending: PromiseUnwrap<T>[] = [];
}