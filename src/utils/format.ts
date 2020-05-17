
const NUMBER_UNITS = ['k', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'] as const;
const NUMBER_UNITS_RU: {
    [x in ((typeof NUMBER_UNITS)[any] | '')]: string
} = {
    '': '',
    k: 'тыс.',
    M: 'млн',
    G: 'млрд',
    T: 'трлн',
    P: 'квдрлн',
    E: 'квинт',
    Z: 'скст',
    Y: 'септ'
};

/**
 * Shorten number to thousands, millions, billions, etc.
 * http://en.wikipedia.org/wiki/Metric_prefix
 *
 * @param {number} num Number to shorten.
 * @param {number} [digits=0] The number of digits to appear after the decimal point.
 * @returns {string|number}
 *
 * @example
 * // returns '12.5k'
 * shortenLargeNumber(12543, 1)
 *
 * @example
 * // returns '-13k'
 * shortenLargeNumber(-12567)
 *
 * @example
 * // returns '51M'
 * shortenLargeNumber(51000000)
 *
 * @example
 * // returns 651
 * shortenLargeNumber(651)
 *
 * @example
 * // returns 0.12345
 * shortenLargeNumber(0.12345)
 */
export function shortenLargeNumber(num: number, digits?: number) {
    let decimal;

    let outNum = num;
    let outUnit: (typeof NUMBER_UNITS)[any] | '' = '';

    walkUnits: for(var i=NUMBER_UNITS.length-1; i>=0; i--) {
        decimal = Math.pow(1000, i+1);

        // if(num <= -decimal || num >= decimal) {
        if (Math.abs(num) >= decimal) {
            outNum = +(num / decimal).toFixed(digits);
            outUnit = NUMBER_UNITS[i];
            break walkUnits;
        }
    }

    return {
        num: outNum,
        unit: outUnit,
    };
}

export function shortenLargeNumberRu(num: number, digits?: number) {
    const { unit, num: n } = shortenLargeNumber(num, digits);
    
    return {
        unit: NUMBER_UNITS_RU[unit],
        num: n,
    };
}

const intlNumber = new Intl.NumberFormat();

export function intplFormatNumber(num: number) {
    return intlNumber.format(num);
}
