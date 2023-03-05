export default class Random {
    constructor(inclusive = true) {
        this.inclusive = inclusive;
    }

    /**
     * 
     * @param {Number} int the maximum value (inclusive)
     * @returns a number between 0 and int
     */
    nextInt(int) {
        return this.randint(0, int - (this.inclusive ? 0 : 1));
    }

    /**
     * 
     * @param {Number} min 
     * @param {Number} max 
     * @returns a number >= min and <= max
     */
    randint(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
    
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    intFromArray(array) {
        return this.nextInt(array.length - 1);
    }

    fromArray(array) {
        return array[this.intFromArray(array)];
    }
}