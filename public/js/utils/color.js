function colorToString(color, alfa = undefined) {
    return `rgba(${color.rgba.r}, ${color.rgba.g}, ${color.rgba.b}, ${alfa ? alfa : 1})`;
}