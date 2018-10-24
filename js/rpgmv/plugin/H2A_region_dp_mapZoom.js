/*:
 * @plugindesc DP_MapZoom.jsをリージョンIDと同期
 * 
 * @param list
 * @type struct<arg>[]
 * @default ["{\"regionId\":\"0\",\"zoom\":\"1\",\"duration\":\"0\",\"callbackEventID\":\"\\\"() => null\\\"\"}"]
 * 
 * @help
 * マップ画面拡大縮小プラグイン
 * https://github.com/drowsepost/rpgmaker-mv-plugins
 * 適用時に特定のリージョンIDを踏んだとき拡大率を変更できるようにする
 * 
 * 並列処理で H2A_region_dp_mapZoom.update()
 */
/*~struct~arg:
 * @param regionId
 * @type number
 * @min 0
 * @default 0
 * 
 * @param zoom
 * @type number
 * @default 1
 * 
 * @param duration
 * @type number
 * @min 1
 * @default 10
 * 
 * @param callbackEventID
 * @type note
 * @default "-1"
 * @desc 最終的な答えをイベントIDの数値にする。-1の場合は主人公
 */

let H2A_region_dp_mapZoom = {};
(() => {
  const pluginName = "H2A_region_dp_mapZoom";
  const params = JSON.parse(
    JSON.stringify(PluginManager.parameters(pluginName), (k, v) => {
      try {
        return JSON.parse(v);
      } catch (k) {
        try {
          return eval(v);
        } catch (k) {
          return v;
        }
      }
    })
  );
  H2A_region_dp_mapZoom = {
    list: [...params.list],
    prevStep: Number.NaN,
    zoom: drowsepost.camera.zoom,
    update: function () {
      if ($gameParty.steps() !== this.prevStep) {
        this.prevStep = $gameParty.steps();
        const rid = $gameMap.regionId($gamePlayer.x, $gamePlayer.y);
        this.list.filter(v => v.regionId === rid).forEach(v => {
          drowsepost.camera.zoom(v.zoom, v.duration, eval(v.callbackEventID));
        })
      }
    }
  }
})()
