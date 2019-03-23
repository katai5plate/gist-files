var lerp = (x, y, a) => x + (y - x) * a;
var lerp2D = ({x: x1, y: y1}, {x: x2, y: y2}, a) => ({x: lerp(x1, x2, a), y: lerp(y1, y2, a)});
