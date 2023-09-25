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

function min(num1, num2) {
    return num1 < num2 ? num1 : num2;
}

function dist(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}
