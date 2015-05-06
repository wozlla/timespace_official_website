function extend(destination, source) {
    var property = "";

    for (property in source) {
        destination[property] = source[property];
    }
    return destination;
}

module.exports = {
    extend:extend
};

