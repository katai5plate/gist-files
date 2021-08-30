class Point {
  /**
   * @param {number} x
   * @param {number} y
   */
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}
class Line {
  /**
   * @param {Point} f
   * @param {Point} t
   */
  constructor(f, t) {
    this.f = f;
    this.t = t;
    this.isCrossing = false;
  }
}

/**
 * 線と線の交差判定
 * @param {Line} a
 * @param {Line} b
 * @returns {boolean}
 */
const isCrossingLines = (a, b) => {
  const [
    {
      f: { x: afx, y: afy },
      t: { x: atx, y: aty },
    },
    {
      f: { x: bfx, y: bfy },
      t: { x: btx, y: bty },
    },
  ] = [a, b];
  return (
    ((afx - atx) * (bfy - afy) + (afy - aty) * (afx - bfx)) *
      ((afx - atx) * (bty - afy) + (afy - aty) * (afx - btx)) <
      0 &&
    ((bfx - btx) * (afy - bfy) + (bfy - bty) * (bfx - afx)) *
      ((bfx - btx) * (aty - bfy) + (bfy - bty) * (bfx - atx)) <
      0
  );
};

/**
 * 点と線の当たり判定
 * @param {Point} point
 * @param {Line} line
 * @returns {boolean}
 */
const isPointOnLine = (point, line) => {
  const [
    { x, y },
    {
      f: { x: fx, y: fy },
      t: { x: tx, y: ty },
    },
  ] = [point, line];
  return (
    Math.max(fx, tx) >= x &&
    x >= Math.min(fx, tx) &&
    Math.max(fy, ty) >= y &&
    y >= Math.min(fy, ty) &&
    (fy - ty) * (x - fx) == (y - fy) * (fx - tx)
  );
};

/**
 * 線と線の重複判定
 * @param {Line} a
 * @param {Line} b
 */
const isOverlappingLine = (a, b) =>
  (isPointOnLine(a.f, b) && isPointOnLine(a.t, b)) ||
  (isPointOnLine(b.f, a) && isPointOnLine(b.t, a));

/**
 * 線と線の当たり判定
 * @param {Line} a
 * @param {Line} b
 */
const collisionLines = (a, b) =>
  isCrossingLines(a, b) || isOverlappingLine(a, b);
