/*:
 * @plugindesc DP_MapZoom.jsをリージョンIDと同期
 * @author Had2App
 * 
 * @param list
 * @type struct<arg>[]
 * @default ["{\"regionId\":\"0\",\"zoom\":\"1\",\"duration\":\"0\",\"callbackEventID\":\"\\\"-1\\\"\"}"]
 * 
 * @help
 * マップ画面拡大縮小プラグイン
 * https://github.com/drowsepost/rpgmaker-mv-plugins
 * 適用時に特定のリージョンIDを踏んだとき拡大率を変更できるようにする
 * 
 * ・使用法
 * 並列処理イベントで常に H2A_region_dp_mapZoom.update() をスクリプト実行することで
 * プラグインの恩恵を得ることができます。
 * 
 * ・callbackEventID について
 * if文などを使用したい場合は、
 * (()=>{...})() または (function(){...})() のようにメソッドを記述して、
 * -1以上の数値 または ゲームイベントオブジェクトを返すものにしてください
 * 
 * ・LICENSES
 * Do What The F*ck You Want To Public License
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
 * @default 1
 * 
 * @param callbackEventID
 * @type note
 * @default "-1"
 * @desc スクリプト記述。最終的な答えをイベントIDの数値にする。-1の場合は主人公
 */

let H2A_region_dp_mapZoom = {};
(() => {
  const pluginName = "H2A_region_dp_mapZoom";
  const params = JSON.parse(
    JSON.stringify(PluginManager.parameters(pluginName), (k, v) => {
      try { return JSON.parse(v); } catch (k) { try { return eval(v); } catch (k) { return v; } }
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
          drowsepost.camera.zoom(v.zoom, v.duration, v.callbackEventID);
        })
      }
    }
  }
})()
