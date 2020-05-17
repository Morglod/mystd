import { arrayToMap } from './index';
import { minMaxOfArray, minMaxInArray } from './utils/math';

const prototype = ([] as any).constructor.prototype.__proto__;

prototype.lastItemIndex = function(this: Array<any>) {
    return this.length - 1;
};

prototype.lastItem = function(this: Array<any>) {
    return this[this.length - 1];
};

prototype.firstItem = function(this: Array<any>) {
    return this[0];
};

prototype.toMap = function(this: Array<any>, mapKey: any) {
    return arrayToMap(this as any, mapKey);
};

prototype.sumNumbers = function(this: Array<any>, key?: any) {
    let result = 0;

    if (key !== undefined) {
        for (const x of this) {
            result += x[key];
        }
    } else {
        for (const x of this) {
            result += x;
        }
    }

    return result;
};

prototype.minMax = function(this: Array<any>, key?: any) {
    if (key) {
        return minMaxInArray(this, key);
    } else {
        return minMaxOfArray(this);
    }
};

prototype.randomItem = function(this: Array<any>) {
    return this[Math.floor(Math.random() * this.length)];
}