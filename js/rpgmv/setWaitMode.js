// 新規モードを登録
const updateWaitMode = Game_Interpreter.prototype.updateWaitMode;
Game_Interpreter.prototype.updateWaitMode = function() {
  if (this._waitMode === "force") return true;
  return updateWaitMode.call(this);
};
// 実用
$gameMap._interpreter.setWaitMode("force");
setTimeout(() => $gameMap._interpreter.setWaitMode(""), 1000);
// これで次のコマンドイベントまで待つ
