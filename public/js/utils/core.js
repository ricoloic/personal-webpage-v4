const PI = Math.PI;
const TWO_PI = Math.PI * 2;

function random(min = undefined, max = undefined) {
    if (!min) return Math.random();

    if (Array.isArray(min)) return min[Math.floor(Math.random() * min.length)];

    if (!max) return Math.random() * min;

    return Math.random() * (max - min) + min;
}

function map(value, oldMin, oldMax, newMin, newMax) {
    var newValue =
        ((value - oldMin) * (newMax - newMin)) / (oldMax - oldMin) + newMin;
    return Math.min(Math.max(newValue, newMin), newMax);
}
