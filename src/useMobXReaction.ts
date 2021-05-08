// @ts-ignore
import { reaction } from "mobx";
import { useEffect, useState } from "react";

export function useMobXReaction<T>(whatObservable: () => T): T {​​​​​​​​​​​​​
    const [ value, setValue ] = useState<T>(() => whatObservable());

    useEffect(() => {​​​​​​​​​​​​​
        reaction(whatObservable, (newValue: any) => setValue(newValue));
    }​​​​​​​​​​​​​, []);

    return value;
}​​​​​​​​​​​​​
