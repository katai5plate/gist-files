/*:
 * @plugindesc 特定のユーザーIDのプレイを抑止する。
 * @author Had2Apps
 * @param ids
 * @desc BANするユーザーID
 * @type Number[]
 * @default []
 * @param message
 * @desc BAN 時の文言
 * @type string
 * @default あなたの環境はプレイ要件を満たしていません。
 * @help
 * 特定のユーザーIDを持つプレイヤーがゲームを遊べないようにします。
 * エラー画面中にコメントの書き込みがあった場合は「__ng」に投稿されます。
 */
(function () {
  var params = PluginManager.parameters("H2A_Ban");
  // [].includes polyfill
  if (!Array.prototype.includes) {
    Object.defineProperty(Array.prototype, "includes", {
      value: function (searchElement, fromIndex) {
        if (this == null) {
          throw new TypeError('"this" is null or not defined');
        }
        var o = Object(this);
        var len = o.length >>> 0;
        if (len === 0) {
          return false;
        }
        var n = fromIndex | 0;
        var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);
        while (k < len) {
          if (o[k] === searchElement) {
            return true;
          }
          k++;
        }
        return false;
      },
    });
  }
  // main
  if (window.RPGAtsumaru === undefined) {
    console.warn("APIが読み込めません");
    return;
  }
  window.RPGAtsumaru.experimental.user.getSelfInformation().then((info) => {
    if (JSON.parse(params.ids).includes(info.id)) {
      window.RPGAtsumaru.comment.resetAndChangeScene("__ng");
      SceneManager.stop();
      Graphics.printError(params.message);
      AudioManager.stopAll();
    }
  });
})();
