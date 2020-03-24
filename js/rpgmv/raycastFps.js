const toRad = 180 / Math.PI;
const toDeg = Math.PI / 180;
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
  constructor(vec, record, dist) {
    super(vec.x, vec.y);
    this.record = record;
    this.dist = dist;
  }
}
class Ray {
  constructor(position, direction) {
    this.position = new Vec(position.x, position.y);
    this.direction = new Vec(direction.x, direction.y);
  }
  static angleToDirection(angle) {
    return new Vec(
      Math.cos(limit(angle) * toDeg),
      Math.sin(limit(angle) * toDeg)
    );
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
    ctx.strokeStyle = "rgba(255,255,0,0.5)";
    ctx.beginPath();
    ctx.moveTo(this.a.x, this.a.y);
    ctx.lineTo(this.b.x, this.b.y);
    ctx.closePath();
    ctx.stroke();
  }
  dist() {
    return Math.sqrt((this.a.x - this.b.x) ** 2 + (this.a.y - this.b.y) ** 2);
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
    const rays = [...new Array(45).keys()].map(
      i => new Ray(this.position, Ray.angleToDirection(i - window.player.angle))
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
        corners.push(new Corner(closest, record, record.dist()));
      }
    }
    this.corners = corners; //.sort((a, b) => a.angle - b.angle);
  }
  /** @param {CanvasRenderingContext2D} ctx */
  draw(ctx) {
    ctx.strokeStyle = "rgba(255,0,0,0.5)";
    this.corners.forEach(vec => {
      ctx.beginPath();
      ctx.moveTo(this.position.x, this.position.y);
      ctx.lineTo(vec.x, vec.y);
      ctx.closePath();
      ctx.stroke();
    });

    ctx.strokeStyle = "rgba(255,127,0,0.5)";
    this.corners.forEach(vec => {
      ctx.beginPath();
      ctx.arc(vec.x, vec.y, 5, 0, 2 * Math.PI);
      ctx.closePath();
      ctx.stroke();
    });
  }
}
window.run = () => {
  window.points = new Points();
  window.player = {
    pos: new Vec($gamePlayer.screenX(), $gamePlayer.screenY() - 24),
    angle: 0,
    angleOffset: -22.5
  };
  const id = "raycast";
  const mapData = [
    ...new Array($dataMap.width * $dataMap.height).keys()
  ].reduce((p, i) => {
    const x = i % $dataMap.width;
    const y = (i / $dataMap.width) | 0;
    const detectWall = (xx, yy) =>
      $gameMap.terrainTag(xx, yy) === 1 || $gameMap.regionId(xx, yy) === 1;
    const [top, left, right, bottom] = [
      { x: 0, y: -1 },
      { x: -1, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: 1 }
    ].map(w => !detectWall(x + w.x, y + w.y));
    if (!detectWall(x, y)) return p;
    return [...p, { x, y, top, left, bottom, right }];
  }, []);
  setInterval(() => {
    if (Input.isPressed("left")) {
      player.angle++;
    }
    if (Input.isPressed("right")) {
      player.angle--;
    }
    if (Input.isPressed("up")) {
      player.pos.x += Math.cos(
        limit(player.angle + player.angleOffset) * (Math.PI / 180)
      );
      player.pos.y -= Math.sin(
        limit(player.angle + player.angleOffset) * (Math.PI / 180)
      );
      // player.pos.y += Math.sin(player.angle * (Math.PI / 180));
    }
    const walls = [
      ...mapData
        .filter(({ x, y }) => {
          return (
            $gameMap._displayX - 1 < x &&
            x < $gameMap._displayX + width() / 48 &&
            $gameMap._displayY - 1 < y &&
            y < $gameMap._displayY + width() / 48
          );
        })
        .reduce((p, { x, y, top, left, right, bottom }) => {
          const [tx, ty, dx, dy] = [
            -$gameMap._displayX + x,
            -$gameMap._displayY + y,
            -$gameMap._displayX + x + 1,
            -$gameMap._displayY + y + 1
          ].map(v => v * 48);
          return [
            ...p,
            ...[
              top &&
                new Line(new Vec(tx, ty), new Vec(dx, ty).add(new Vec(1, 0))),
              left &&
                new Line(new Vec(tx, ty), new Vec(tx, dy).add(new Vec(0, 1))),
              right &&
                new Line(new Vec(dx, dy).add(new Vec(0, 1)), new Vec(dx, ty)),
              bottom &&
                new Line(new Vec(dx, dy).add(new Vec(1, 0)), new Vec(tx, dy))
            ].filter(Boolean)
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

    // 上空壁描画
    walls.forEach(wall => wall.draw(ctx));

    // 上空レイ描画
    points.update(player.pos);
    points.look(walls, true);
    points.draw(ctx);

    // FPS壁描画
    points.corners.forEach(({ dist }, i, { length }) => {
      const per = 1 - dist / 400;
      ctx.fillStyle = `rgba(0,127,0,${per})`;
      const h = height() * per;
      ctx.fillRect(
        (i / length) * width(),
        height() / 2 - h / 2,
        width() / length,
        h
      );
    });
  }, 10);
};
