const toRad = (Math.PI * 2) / 360;
const toDeg = 360 / (Math.PI * 2);
const limit = deg => ((deg % 360) + 360) % 360;
const width = () => SceneManager._screenWidth;
const height = () => SceneManager._screenHeight;
let mx, my;
const mouseX = () => {
  mx = !TouchInput.x ? mx : TouchInput.x;
  return mx;
};
const mouseY = () => {
  my = !TouchInput.y ? my : TouchInput.y;
  return my;
};

class Vec {
  constructor(x = NaN, y = NaN) {
    this.x = x;
    this.y = y;
  }
  mag() {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }
  normalize() {
    const length = this.mag();
    if (length !== 0) {
      this.x *= 1 / length;
      this.y *= 1 / length;
    }
    return this;
  }
  isEmpty() {
    return this.x === NaN || this.y === NaN;
  }
  add(vec) {
    return new Vec(this.x + vec.x, this.y + vec.y);
  }
}
class Corner extends Vec {
  constructor(vec, angle, dist) {
    super(vec.x, vec.y);
    this.angle = angle;
    this.dist = dist;
  }
}
class Ray {
  constructor(position, direction) {
    this.position = new Vec(position.x, position.y);
    this.direction = new Vec(direction.x, direction.y);
  }
  static angleToDirection(angle) {
    return new Vec(Math.cos(angle * toDeg), Math.sin(angle * toDeg));
  }
  static positionToDirection(startPosition, destPosition) {
    return new Vec(
      destPosition.x - startPosition.x,
      destPosition.y - startPosition.y
    ).normalize();
  }
  cast(wall) {
    const [x1, y1, x2, y2, x3, y3, x4, y4] = [
      wall.a.x,
      wall.a.y,
      wall.b.x,
      wall.b.y,
      this.position.x,
      this.position.y,
      this.position.x + this.direction.x,
      this.position.y + this.direction.y
    ];
    const den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
    if (den === 0) return;
    const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den;
    const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / den;
    if (t > 0 && t < 1 && u > 0) {
      return new Vec(x1 + t * (x2 - x1), y1 + t * (y2 - y1));
    }
  }
}
class Line {
  constructor(a, b) {
    this.a = new Vec(a.x, a.y);
    this.b = new Vec(b.x, b.y);
  }
  /** @param {CanvasRenderingContext2D} ctx */
  draw(ctx) {
    ctx.strokeStyle = "white";
    ctx.beginPath();
    ctx.moveTo(this.a.x, this.a.y);
    ctx.lineTo(this.b.x, this.b.y);
    ctx.closePath();
    ctx.stroke();
  }
  dist() {
    return Math.sqrt((this.a.x - this.b.x) ** 2 + (this.a.y - this.b.y) ** 2);
  }
  toAngle() {
    return limit(Math.atan2(this.b.y - this.a.y, this.b.x - this.a.x) * toDeg);
  }
}
class Points {
  constructor() {
    this.position = new Vec();
    this.corners = [];
  }
  update(position) {
    this.position = new Vec(position.x, position.y);
  }
  look(walls) {
    if (this.position.isEmpty()) {
      this.corners = [];
      return;
    }
    const rays =
      walls.length * 2 * 4 < 360
        ? walls
            .reduce((p, { a, b }) => [...p, a, b], [])
            .reduce(
              (p, vec) => [
                ...p,
                new Ray(
                  this.position,
                  Ray.positionToDirection(
                    this.position,
                    vec.add(new Vec(-1, -1))
                  )
                ),
                new Ray(
                  this.position,
                  Ray.positionToDirection(
                    this.position,
                    vec.add(new Vec(-1, 1))
                  )
                ),
                new Ray(
                  this.position,
                  Ray.positionToDirection(
                    this.position,
                    vec.add(new Vec(1, -1))
                  )
                ),
                new Ray(
                  this.position,
                  Ray.positionToDirection(this.position, vec.add(new Vec(1, 1)))
                )
              ],
              []
            )
        : [...new Array(360).keys()].map(
            i => new Ray(this.position, Ray.angleToDirection(i))
          );
    let corners = [];
    for (let ray of rays) {
      let record = null;
      let closest = null;
      for (let wall of walls) {
        const pt = ray.cast(wall);
        if (pt) {
          const temp = new Line(this.position, pt);
          if (record === null || temp.dist() < record.dist()) {
            record = temp;
            closest = pt;
          }
        }
      }
      if (closest) {
        corners.push(new Corner(closest, record.toAngle(), record.dist()));
      }
    }
    this.corners = corners.sort((a, b) => a.angle - b.angle);
  }
  /** @param {CanvasRenderingContext2D} ctx */
  draw(ctx) {
    ctx.strokeStyle = "red";
    this.corners.forEach(vec => {
      ctx.beginPath();
      ctx.moveTo(this.position.x, this.position.y);
      ctx.lineTo(vec.x, vec.y);
      ctx.closePath();
      ctx.stroke();
    });

    ctx.fillStyle = "rgba(0,255,255,0.5)";
    ctx.beginPath();
    this.corners.forEach((vec, i) => {
      if (i === 0) {
        return ctx.moveTo(vec.x, vec.y);
      }
      ctx.lineTo(vec.x, vec.y);
    });
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = "red";
    ctx.beginPath();
    this.corners.forEach(vec => {
      ctx.arc(vec.x, vec.y, 5, 0, 2 * Math.PI);
    });
    ctx.closePath();
    ctx.stroke();
  }
}
window.run = () => {
  const points = new Points();
  const id = "raycast";
  setInterval(() => {
    const walls = [
      ...new Array(0)
        .fill(0)
        .map(
          () =>
            new Line(
              new Vec(Math.random() * width(), Math.random() * height()),
              new Vec(Math.random() * width(), Math.random() * height())
            )
        ),
      ...[...new Array($dataMap.width * $dataMap.height).keys()]
        .map(i => ({ x: i % $dataMap.width, y: (i / $dataMap.width) | 0 }))
        .filter(
          v =>
            $gameMap.terrainTag(v.x, v.y) === 1 ||
            $gameMap.regionId(v.x, v.y) === 1
        )
        .reduce((p, { x, y }) => {
          const [tx, ty, dx, dy] = [
            -$gameMap._displayX + x,
            -$gameMap._displayY + y,
            -$gameMap._displayX + x + 1,
            -$gameMap._displayY + y + 1
          ].map(v => v * 48);
          return [
            ...p,
            new Line(new Vec(tx, ty), new Vec(dx, ty).add(new Vec(1, 1))),
            new Line(new Vec(tx, ty), new Vec(tx, dy).add(new Vec(1, 1))),
            new Line(new Vec(dx, dy).add(new Vec(1, 1)), new Vec(dx, ty)),
            new Line(new Vec(dx, dy).add(new Vec(1, 1)), new Vec(tx, dy))
          ];
        }, []),
      new Line(new Vec(0, 0), new Vec(width(), 0)),
      new Line(new Vec(0, 0), new Vec(0, height())),
      new Line(new Vec(width(), height()), new Vec(width(), 0)),
      new Line(new Vec(width(), height()), new Vec(0, height()))
    ];
    if (!SceneManager._scene[id]) {
      SceneManager._scene[id] = new Sprite();
      SceneManager._scene[id].bitmap = new Bitmap(width(), height());
      SceneManager._scene.addChild(SceneManager._scene[id]);
    }
    const { bitmap } = SceneManager._scene[id];
    bitmap.clear();
    /** @type {CanvasRenderingContext2D} */
    const ctx = bitmap.context;

    // 壁描画
    walls.forEach(wall => wall.draw(ctx));

    // ポインタ描画
    // ctx.strokeStyle = "white";
    // ctx.beginPath();
    // ctx.arc(mouseX(), mouseY(), 5, 0, 2 * Math.PI);
    // ctx.stroke();

    // レイ描画
    points.update(new Vec($gamePlayer.screenX(), $gamePlayer.screenY()));
    points.look(walls, true);
    points.draw(ctx);
  }, 10);
};
