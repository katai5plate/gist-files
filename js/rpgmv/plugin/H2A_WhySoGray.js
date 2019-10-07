/*:
 * @plugindesc レイヤーごとにグレースケールを適用する
 * @author Had2Apps
 * @help
 * 全部グレーにする: $h2aWhySo.gray(L)
 * 解除: $h2aWhySo.fine()
 *
 * プレイヤーをグレーにする: $h2aWhySo.changePlayerToGray(L)
 * 解除: $h2aWhySo.restorePlayerColor()
 *
 * マップをグレーにする: $h2aWhySo.changeMapToGray(L)
 * 解除: $h2aWhySo.restoreMapColor()
 *
 * イベントをグレーにする: $h2aWhySo.changeEventsToGray(L)
 * 解除: $h2aWhySo.restoreEventColors()
 * グレーにしたくないイベントは、メモ欄に ungrayscalable を書く。
 *
 * 引数 L は、グレー指数。デフォルトは 0.5 。
 * 0.00: 無効
 * 0.25: 少しグレー
 * 0.50: グレー
 * 0.75: 暗めのグレー
 * 1.00: 暗転
 *
 * プレイヤーの歩行グラの Sprite を参照する: $spritePlayer
 * イベントの歩行グラの Sprite を参照する: $spriteEvents
 * 乗り物の歩行グラの Sprite を参照する: $spriteVehicles
 * パーティの歩行グラの Sprite を参照する: $spriteFollowers
 * タイルマップ情報を参照する: $tilemap
 *
 * This software is released under the Do What The Fuck You Want To Public License.
 * http://www.wtfpl.net/
 *
 * @param ungrayscalable
 * @type string
 * @desc グレーにしたくないイベントのメモ欄に書く文字列
 * @default ungrayscalable
 */
(() => {
  // 定数
  const GRAY_LEVEL = 1 / 2;
  const GRAY_MATRIX = 1 / 3;

  // x から y までの値の中間値を 0 ～ 1 の a で取得
  Math.lerp = (x, y, a) => x + (y - x) * a;

  const _createCharacters = Spriteset_Map.prototype.createCharacters;
  Spriteset_Map.prototype.createCharacters = function() {
    _createCharacters.call(this);
    this._characterSprites = [];

    const that = this; // 追記。
    window.$spritePlayer = new Sprite_Character($gamePlayer); // 追記。グローバル化

    // 塗り替え
    // $gameMap.events().forEach(function(event) {
    //   this._characterSprites.push(new Sprite_Character(event));
    // }, this);
    // ↓
    window.$spriteEvents = $gameMap.events().map(event => {
      const x = new Sprite_Character(event);
      x.__origin = event;
      return x;
    });
    window.$spriteEvents.forEach(item => {
      that._characterSprites.push(item);
    });

    // 塗り替え
    // $gameMap.vehicles().forEach(function(vehicle) {
    //   this._characterSprites.push(new Sprite_Character(vehicle));
    // }, this);
    // ↓
    window.$spriteVehicles = $gameMap.vehicles().map(vehicle => {
      const x = new Sprite_Character(vehicle);
      x.__origin = vehicle;
      return x;
    });
    window.$spriteVehicles.forEach(item => {
      that._characterSprites.push(item);
    });

    // 塗り替え
    // $gamePlayer.followers().reverseEach(function(follower) {
    //   this._characterSprites.push(new Sprite_Character(follower));
    // }, this);
    // ↓
    window.$spriteFollowers = $gamePlayer
      .followers()
      ._data.map(follower => {
        const x = new Sprite_Character(follower);
        x.__origin = follower;
        return x;
      })
      .reverse();
    window.$spriteFollowers.forEach(item => {
      that._characterSprites.push(item);
    });

    this._characterSprites.push(window.$spritePlayer); // 変更。

    for (var i = 0; i < this._characterSprites.length; i++) {
      this._tilemap.addChild(this._characterSprites[i]);
    }
  };

  const _createTilemap = Spriteset_Map.prototype.createTilemap;
  Spriteset_Map.prototype.createTilemap = function() {
    _createTilemap.call(this);
    /* 内部データを書き換えないので既存部を上書きしない */
    window.$tilemap = this._tilemap; // 追記。グローバル化
    window.$h2aWhySo = new WhySoGray(); // 追記。プラグイン実行関数の定義
  };

  class WhySoGray {
    constructor() {
      // カラーマトリクスの計算
      const x = 1 / 3;
      this._colorMatrix = [
        ...[x, x, x, 0, 0],
        ...[x, x, x, 0, 0],
        ...[x, x, x, 0, 0],
        ...[0, 0, 0, 1, 0]
      ];
      // フィルター初期化
      this.grayscaleFilter = new PIXI.filters.ColorMatrixFilter();
      // フィルター適用範囲の設定
      const { width: WIDTH, height: HEIGHT } = Graphics;
      this.filterArea = new PIXI.Rectangle(0, 0, WIDTH, HEIGHT);
      // キャラ色
      this._colorTone = [0, 0, 0, 255];
      // 初期化処理へ
      this.initialize();
    }
    setGray(level) {
      // 0 ～ 0.5 ～ 1: 通常 ～ グレー ～ 暗転
      const isFadingGray = level <= GRAY_LEVEL;
      const fixedLevel = isFadingGray ? level * 2 : (level - GRAY_LEVEL) * 2;
      // カラーマトリクス
      if (isFadingGray) {
        const c = Math.lerp(0, GRAY_MATRIX, fixedLevel);
        const k = Math.lerp(1, GRAY_MATRIX, fixedLevel);
        this._colorMatrix = [
          ...[k, c, c, 0, 0],
          ...[c, k, c, 0, 0],
          ...[c, c, k, 0, 0],
          ...[0, 0, 0, 1, 0]
        ];
      } else {
        const b = Math.lerp(GRAY_MATRIX, 0, fixedLevel);
        this._colorMatrix = [
          ...[b, b, b, 0, 0],
          ...[b, b, b, 0, 0],
          ...[b, b, b, 0, 0],
          ...[0, 0, 0, 1, 0]
        ];
      }
      // カラーマトリクスフィルターにさっき計算したカラーマトリクスを入れる
      this.grayscaleFilter.matrix = this._colorMatrix;
      // キャラ色
      if (isFadingGray) {
        const t = Math.lerp(0, 255, fixedLevel);
        this._colorTone = [0, 0, 0, t];
      } else {
        const a = Math.lerp(0, -255, fixedLevel);
        this._colorTone = [a, a, a, 255];
      }
    }
    initialize() {
      // カラーマトリクスフィルターにさっき計算したカラーマトリクスを入れる
      this.grayscaleFilter.matrix = this._colorMatrix;
      // 上下層レイヤーのフィルター適用範囲を設定
      window.$tilemap.lowerZLayer.filterArea = this.filterArea;
      window.$tilemap.upperZLayer.filterArea = this.filterArea;
    }
    changePlayerToGray(level = GRAY_LEVEL) {
      this.setGray(level);
      // キャラのトーンを変更
      window.$spritePlayer.setColorTone(this._colorTone);
    }
    changeMapToGray(level = GRAY_LEVEL) {
      this.setGray(level);
      // レイヤーにフィルター設定
      window.$tilemap.lowerZLayer.filters = [this.grayscaleFilter];
      window.$tilemap.upperZLayer.filters = [this.grayscaleFilter];
    }
    changeEventsToGray(level = GRAY_LEVEL) {
      this.setGray(level);
      // 除外イベントIDの収集
      const ignoreEventIds = $dataMap.events
        .filter(
          v =>
            v &&
            v.note.match(
              new RegExp(
                PluginManager.parameters("H2A_WhySoGray").ungrayscalable
              )
            )
        )
        .map(v => v.id);
      // イベント画像のうち...
      window.$spriteEvents.map(item => {
        // 除外イベントIDの中にないものは...
        if (!ignoreEventIds.includes(item.__origin._eventId)) {
          // イベントのトーンを変更
          item.setColorTone(this._colorTone);
        }
      });
    }
    restorePlayerColor() {
      // キャラのトーンを戻す
      window.$spritePlayer.setColorTone([0, 0, 0, 0]);
    }
    restoreMapColor() {
      // レイヤーのフィルターを空にする
      window.$tilemap.lowerZLayer.filters = [];
      window.$tilemap.upperZLayer.filters = [];
    }
    restoreEventColors() {
      // 全イベントのトーンを戻す
      window.$spriteEvents.map(item => {
        item.setColorTone([0, 0, 0, 0]);
      });
    }
    // マップ上で呼び出す用
    gray(level = GRAY_LEVEL) {
      this.changePlayerToGray(level);
      this.changeMapToGray(level);
      this.changeEventsToGray(level);
    }
    // マップ上で呼び出す用
    fine() {
      this.restorePlayerColor();
      this.restoreMapColor();
      this.restoreEventColors();
    }
  }
})();
