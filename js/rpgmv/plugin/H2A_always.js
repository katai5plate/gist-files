/*:
 * @plugindesc 常に実行
 * @param script
 * @type note
 * @default "(()=>{\n\/* process *\/\n})()"
 */
const { update } = $gameMap;
$gameMap.update = function () {
  update.apply(this);
  eval(PluginManager._parameters.H2A_always.script);
}
