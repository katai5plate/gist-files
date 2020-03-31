/*:
 * @plugindesc 直接図形などを描き込めるようにする
 * @author Had2Apps
 *
 * @help
 *
 * スクリプト記述例
 *
 * const draw = new H2A_Context({
 *   update: ctx => {
 *     const { _ } = ctx;
 *     _.line(_.mouseX(), _.mouseY(), _.pmouseX(), _.pmouseY());
 *     _.rect(0, 0, _.mouseX(), _.mouseY());
 *     _.circle(_.mouseX(), _.mouseY(), 100);
 *   }
 * });
 * draw.addScene();
 *
 */

(() => {
  var _TouchInput__onMouseMove = TouchInput._onMouseMove;
  TouchInput._onMouseMove = function(event) {
    _TouchInput__onMouseMove.apply(this, arguments);
    this.pmouseX = this.mouseX;
    this.pmouseY = this.mouseY;
    this.mouseX = Graphics.pageToCanvasX(event.pageX);
    this.mouseY = Graphics.pageToCanvasY(event.pageY);
  };
  class H2A_Context extends Sprite {
    constructor({
      x = 0,
      y = 0,
      w = Graphics._canvas.width,
      h = Graphics._canvas.height,
      update = () => {}
    }) {
      super();
      this.x = x;
      this.y = y;
      this.bitmap = new Bitmap(w, h);
      this.bitmap.clear();
      this.onUpdate = update;
      this.interval = null;
      /** @type {CanvasRenderingContext2D} */
      const ctx = this.bitmap.context;
      const constants = {
        BOTH: "BOTH",
        STROKE: "STROKE",
        FILL: "FILL"
      };
      this.bitmap.context._ = {
        ...constants,
        // 座標系
        mouseX: () => TouchInput.mouseX,
        mouseY: () => TouchInput.mouseY,
        pmouseX: () => TouchInput.pmouseX,
        pmouseY: () => TouchInput.pmouseY,
        width: () => Graphics._canvas.width,
        height: () => Graphics._canvas.height,
        cwidth: () => this.width,
        cheight: () => this.height,
        // 演算系
        toDeg: x => (x * Math.PI) / 180,
        // スタイル系
        fill: (r, g, b, a = 255) => {
          ctx.fillStyle = `rgba(${r},${g},${b},${a / 255})`;
        },
        stroke: (r, g, b, a = 255) => {
          ctx.strokeStyle = `rgba(${r},${g},${b},${a / 255})`;
        },
        strokeWidth: (x = 1) => {
          ctx.lineWidth = x;
        },
        color: (r, g, b, a = 255) => {
          this.bitmap.context._.fill(r, g, b, a);
          this.bitmap.context._.stroke(r, g, b, a);
        },
        // 図形描画系
        line: (x1, y1, x2, y2) => {
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        },
        lines: arr => {
          ctx.beginPath();
          arr.forEach(([x, y], i) => {
            if (i === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
          });
          ctx.closePath();
          ctx.stroke();
        },
        rect: (x, y, w, h, mode = constants.BOTH) => {
          if (mode !== constants.STROKE) {
            ctx.fillRect(x, y, w, h);
          }
          if (mode !== constants.FILL) {
            ctx.strokeRect(x, y, w, h);
          }
        },
        quad: (x1, y1, x2, y2, x3, y3, x4, y4, mode = constants.BOTH) => {
          ctx.beginPath();
          [
            [x1, y1],
            [x2, y2],
            [x3, y3],
            [x4, y4]
          ].forEach(([x, y], i) => {
            if (i === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
          });
          ctx.closePath();
          if (mode !== constants.STROKE) {
            ctx.fill();
          }
          if (mode !== constants.FILL) {
            ctx.stroke();
          }
        },
        poly: (arr, mode = constants.BOTH) => {
          ctx.beginPath();
          arr.forEach(([x, y], i) => {
            if (i === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
          });
          ctx.closePath();
          if (mode !== constants.STROKE) {
            ctx.fill();
          }
          if (mode !== constants.FILL) {
            ctx.stroke();
          }
        },
        arc: (
          x,
          y,
          r,
          startAngle,
          endAngle,
          mode = constants.BOTH,
          noPie = false
        ) => {
          ctx.beginPath();
          if (!noPie) ctx.moveTo(x, y);
          ctx.arc(
            x,
            y,
            r,
            this.bitmap.context._.toDeg(startAngle),
            this.bitmap.context._.toDeg(endAngle)
          );
          if (!noPie) ctx.lineTo(x, y);
          ctx.closePath();
          if (mode !== constants.STROKE) {
            ctx.fill();
          }
          if (mode !== constants.FILL) {
            ctx.stroke();
          }
        },
        circle: (x, y, r, mode = constants.BOTH) => {
          this.bitmap.context._.arc(x, y, r, 0, 360, mode, true);
        },
        image: (url, x, y) => {
          const image = new Image();
          image.src = url;
          ctx.drawImage(image, x, y);
        },
        imageTrim: (url, devideX, devideY, cellX, cellY, x, y) => {
          const image = new Image();
          image.src = url;
          const sw = image.width / devideX;
          const sh = image.height / devideY;
          const sx = sw * cellX;
          const sy = sh * cellY;
          ctx.drawImage(image, sx, sy, sw, sh, x, y, sw, sh);
        }
      };
      this.bitmap.context._.fill(255, 255, 255);
      this.bitmap.context._.stroke(0, 0, 0);
    }
    draw() {
      this.bitmap.clear();
      try {
        this.onUpdate(this.bitmap.context);
      } catch (e) {
        this.stopLoop();
        SceneManager.catchException(e);
      }
    }
    addScene(noLoop) {
      SceneManager._scene.addChild(this);
      if (!noLoop) {
        this.startLoop();
      }
    }
    startLoop() {
      this.interval = setInterval(this.draw.bind(this), 1);
    }
    stopLoop() {
      clearInterval(this.interval);
      this.interval = null;
    }
    isLooping() {
      return !!this.interval;
    }
  }
  window.H2A_Context = H2A_Context;
})();

// テスト用

// setTimeout(() => {
//   x = new H2A_Canvas({
//     update: ({ _ }) => {
//       _.line(_.mouseX(), _.mouseY(), _.pmouseX(), _.pmouseY());
//       _.rect(0, 0, _.mouseX(), _.mouseY());
//       _.circle(_.mouseX(), _.mouseY(), 100);
//       _.imageTrim(
//         "./img/characters/Actor1.png",
//         12,
//         8,
//         _.mouseX() % 12,
//         _.mouseY() % 8,
//         _.mouseX(),
//         _.mouseY()
//       );
//     }
//   });
//   x.addScene();
// }, 500);
