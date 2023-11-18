function clampLength(x, arr) {
    if (x > arr.length) return 0;
    return x;
}

function clamp(x, min, max) {
    if (x > max) return max;
    else if (x < min) return min;
    return x;
}

module.exports = {
    clampLength: clampLength,
    clamp: clamp,
}
