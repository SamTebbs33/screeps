function clampLength(x, arr) {
    if (x > arr.length) return 0;
    return x;
}

module.exports = {
    clampLength: clampLength,
}
