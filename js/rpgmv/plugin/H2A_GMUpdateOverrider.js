/*:
 * @plugindesc マップの update 関数で任意のコードを実行
 * @author Had2Apps
 *
 * @param awakeCode
 * @type note
 * @param updateCode
 * @type note
 */
"use strict";

(() => {
  const update = Game_Map.prototype.update;
  Game_Map.prototype.update = function() {
    update.call(this, arguments);
    const execute = code => eval(JSON.parse(code));
    const { awakeCode, updateCode } = PluginManager.parameters(
      "H2A_GMUpdateOverrider"
    );
    if (!this.h2aGMUOAwakeCodeIsDone) {
      awakeCode && execute(awakeCode);
      this.h2aGMUOAwakeCodeIsDone = true;
    }
    updateCode && execute(updateCode);
  };
})();
