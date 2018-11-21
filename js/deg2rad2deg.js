const toRad = (Math.PI * 2) / 360;
const toDeg = 360 / (Math.PI * 2);
const limit = deg => (deg % 360 + 360) % 360;

// const degree = 45, radian = deg * toRad;
// limit(-90) // <- 270
