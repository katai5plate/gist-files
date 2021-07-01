/*:
 * @target MZ
 */
(() => {
  /**
   * 文字列のサイズを調べる
   * @param {string} text 文字列
   * @returns {{width:number,height:number}} サイズ
   */
  CanvasRenderingContext2D.prototype.getTextSize = function (text) {
    const measure = this.measureText(text);
    return {
      width: measure.width,
      height:
        measure.actualBoundingBoxAscent + measure.actualBoundingBoxDescent,
    };
  };
  /**
   * 動的表示ログ
   * @param {string} value 値
   * @param {number} x 座標
   * @param {number} y 座標
   */
  CanvasRenderingContext2D.prototype.log = function (value, x = 0, y = 0) {
    const fillStyle = this.fillStyle;
    this.fillStyle = "#fff";
    const text = JSON.stringify(value, null, 2);
    text.split("\n").forEach((line, i) => {
      const { height } = this.getTextSize("あ");
      this.fillText(line, x, y + height * i);
    });
    this.fillStyle = fillStyle;
  };
  /**
   * シンプル直線
   * @param {number} ax 座標
   * @param {number} ay 座標
   * @param {number} bx 座標
   * @param {number} by 座標
   */
  CanvasRenderingContext2D.prototype.line = function (ax, ay, bx, by) {
    this.beginPath();
    this.moveTo(ax, ay);
    this.lineTo(bx, by);
    this.stroke();
  };
  /** 画面タイルX */
  Game_CharacterBase.prototype.screenTileX = function () {
    return Math.floor(this.scrolledX() * $gameMap.tileWidth());
  };
  /** 画面タイルY */
  Game_CharacterBase.prototype.screenTileY = function () {
    return Math.floor(this.scrolledY() * $gameMap.tileHeight());
  };
  /** スプライトオブジェクトを参照 */
  Game_CharacterBase.prototype.getSprite = function () {
    return SceneManager._scene._spriteset._characterSprites.find(
      ({ _character }) => JSON.stringify(_character) === JSON.stringify(this)
    );
  };
  /**
   * キャラクターの周囲にレイキャストを放射し壁を判定する
   * @param {boolean} allDirection 360度放射するか
   * @param {number} safeRegionId 道判定のリージョンID
   * @returns {[number,number][]} 各角度で衝突した座標
   */
  Game_CharacterBase.prototype.shotRaycast = function (
    allDirection = false,
    safeRegionId = 1
  ) {
    // 向きによって角度の範囲を変更
    const arr = ((d) => {
      const a = [...Array(90).keys()].map((x) => x - 45);
      switch (d) {
        case 6:
          return a.map((x) => x + 90 * 0);
        case 2:
          return a.map((x) => x + 90 * 1);
        case 4:
          return a.map((x) => x + 90 * 2);
        case 8:
          return a.map((x) => x + 90 * 3);
        default:
          return [...Array(360).keys()];
      }
    })(allDirection || this._direction);
    // 基点
    const x =
      this.scrolledX() * $gameMap.tileWidth() + $gameMap.tileWidth() / 2;
    const y =
      this.scrolledY() * $gameMap.tileHeight() + $gameMap.tileHeight() / 2;
    return [
      ...(allDirection ? [] : [[x, y]]), // 図形描画時に崩れないように
      ...arr.map((degree) => {
        const radian = degree * (Math.PI / 180);
        let px = x;
        let py = y;
        let dx = Math.cos(radian);
        let dy = Math.sin(radian);
        let ax, ay;
        // 無限ループ回避
        for (let i = 0; i < 10000; i++) {
          ax = Math.floor($gameMap._displayX + px / $gameMap.tileWidth());
          ay = Math.floor($gameMap._displayY + py / $gameMap.tileHeight());
          // 画面外か衝突したらループ終了
          if (
            0 > px ||
            px >= Graphics.boxWidth ||
            0 > py ||
            py >= Graphics.boxHeight ||
            $gameMap.regionId(ax, ay) !== safeRegionId
          )
            break;
          // レイを次の座標へ
          px += dx;
          py += dy;
        }
        return [px, py];
      }),
    ];
  };
  /**
   * AIを使用して指定座標を目指す
   * @param {number} x 座標
   * @param {number} y 座標
   */
  Game_Character.prototype.walkTowards = function (x, y) {
    if (this.x === x && this.y === y) return;
    const dir = this.findDirectionTo(x, y);
    if (!dir) this.moveTowardCharacter({ x, y });
    this.moveStraight(dir);
  };
  /**
   * AIを使用して指定したイベントを目指す
   * @param {number} id イベントID
   */
  Game_Character.prototype.walkTowardsEvent = function (id) {
    const { x, y } = $gameMap.event(id);
    this.walkTowards(x, y);
  };

  // FIXME: ゲーム開始時に始まるようにする
  setTimeout(() => {
    const chorkBitmap = new Bitmap(Graphics.boxWidth, Graphics.boxHeight);
    const chorkSprite = new Sprite(chorkBitmap);
    SceneManager._scene.addChild(chorkSprite);

    /**
     * @param {CanvasRenderingContext2D} context
     */
    const chork = (context) => {
      context.strokeStyle = "rgb(0,255,0)";
      context.fillStyle = "rgba(0,255,0,0.5)";
      context.textBaseline = "top";
      const events = $gameMap._events.slice(1);
      context.log({
        mouse: {
          x: TouchInput.x,
          y: TouchInput.y,
          ax: Math.floor(TouchInput.x / $gameMap.tileWidth()),
          ay: Math.floor(TouchInput.y / $gameMap.tileHeight()),
          p: $gameMap.regionId(
            Math.floor(TouchInput.x / $gameMap.tileWidth()),
            Math.floor(TouchInput.y / $gameMap.tileHeight())
          ),
        },
        events: events.slice(1).map((ev) => ({
          x: ev.screenTileX(),
          y: ev.screenTileY(),
        })),
      });
      events.forEach((ev) => {
        context.strokeRect(ev.screenTileX(), ev.screenTileY(), 48, 48);
      });
      const [[firstX, firstY], ...moreHits] = $gamePlayer.shotRaycast();
      context.beginPath();
      context.moveTo(firstX, firstY);
      context.fillRect(firstX - 10, firstY - 10, 20, 20);
      moreHits.forEach(([px, py]) => {
        context.fillRect(px - 5, py - 5, 10, 10);
        context.lineTo(px, py);
      });
      context.lineTo(firstX, firstY);
      context.closePath();
      context.fill();
      context.fillRect(TouchInput.x, TouchInput.y, 48, 48);
    };
    const i = setInterval(() => {
      chorkSprite.bitmap.clear();
      try {
        chork(chorkSprite.bitmap.context);
      } catch (e) {
        clearInterval(i);
        console.error(e);
      }
      chorkSprite.bitmap.baseTexture.update();
    }, 10);
  }, 1000);
})();
