import { useCallback, useRef } from "react"

export function useCallbackRef<T extends (...args: any) => any>(cb: T): T {​​​
    const stored = useRef(cb);
    stored.current = cb;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const wrappedCb = useCallback(((...args: any) => stored.current(...args)) as any, [ stored ]);
    return wrappedCb;
}​​​
