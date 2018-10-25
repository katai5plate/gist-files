/*:
 * @plugindesc 常に実行
 * @param script
 * @type note
 * @default "(()=>{\n\/* process *\/\n})()"
 */
const { update } = Game_Map.prototype;
Game_Map.prototype.update = function () {
  update.apply(this);
  eval(JSON.parse(PluginManager.parameters("H2A_Always").script));
}
