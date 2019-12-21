/*:
 * @plugindesc マップ上で常に実行する処理を設定する
 * @param script
 * @type note
 * @default "(()=>{\n\/* process *\/\n})()"
 */
const { update } = Game_Map.prototype;
Game_Map.prototype.update = function () {
  update.apply(this);
  eval(JSON.parse(PluginManager.parameters("H2A_Always").script));
}
