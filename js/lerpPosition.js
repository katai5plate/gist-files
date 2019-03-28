var lerp = (x, y, a) => x + (y - x) * a;
var lerp2D = ({x: x1, y: y1}, {x: x2, y: y2}, a) => ({x: x1 + (x2 - x1) * a, y: y1 + (y2 - y1) * a});
