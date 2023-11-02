const PI = Math.PI;
const TWO_PI = Math.PI * 2;

function random(min = undefined, max = undefined) {
    if (min == undefined) return Math.random();

    if (Array.isArray(min)) return min[Math.floor(Math.random() * min.length)];

    if (max == undefined) return Math.random() * min;

    return Math.random() * (max - min) + min;
}

function radiansToDegrees(radians) {
    return radians * (180 / PI);
}

function degreesToRadians(degrees) {
    return degrees * (PI / 180);
}

function constrain(n, low, high) {
    return Math.max(Math.min(n, high), low);
}

function map(n, start1, stop1, start2, stop2, withinBounds) {
    const newval =
        ((n - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
    if (!withinBounds) {
        return newval;
    }
    if (start2 < stop2) {
        return constrain(newval, start2, stop2);
    } else {
        return constrain(newval, stop2, start2);
    }
}

function min(num1, num2) {
    return num1 < num2 ? num1 : num2;
}

function dist(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

function lerp(start, stop, amt) {
    return amt * (stop - start) + start;
}
