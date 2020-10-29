import { lazyComputeOnce, /* memoCompute */ } from "../lazycall";

class A {
    constructor(public x: string, public y: number) {

    }

    str = lazyComputeOnce(() => {
        console.log('call str');
        return this.x + this.y;
    });

    // str2 = memoCompute(() => {
    //     console.log('call str 2');
    //     return this.x + this.y;
    // }, () => [ this.x, this.y ]);
}

const a = new A('hello', 123);

console.log('str ', a.str());
console.log('str ', a.str());
console.log('str ', a.str());

// console.log('str 2 ', a.str2());
// console.log('str 2 ', a.str2());
// console.log('str 2 ', a.str2());

// a.x = 'bye';

// console.log('str 2 ', a.str2());
// console.log('str 2 ', a.str2());
// console.log('str 2 ', a.str2());