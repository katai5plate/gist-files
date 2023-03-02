/*:
 * @target MZ
 * @plugindesc 一つの変数に JSON で状態管理を行う
 * @author Had2Apps
 * @url https://had2apps.com
 *
 * @param variableId
 * @type variable
 * @text 使用する変数
 * @default 1
 *
 * @help
 * １つの変数だけで多くの情報を保存します。
 * JSON 文字列で保存するため、セーブデータの影響を受けません。
 *
 * すべての操作はスクリプトで行います。
 * 記録できる値は JSON で扱える型のみです。
 *
 * ・値を記録する
 * $oneVariable.set("key", "value");
 *
 * ・値を取得する
 * $oneVariable.get("key");
 *
 * ・過去の値をもとに値を変更する
 * $oneVariable.edit("key", value => value, "defaultValue");
 * 「defaultValue」は値が undefined および null だった場合に代入する値です。
 *
 * Copyright (c) 2023 Had2Apps
 * This software is released under the MIT License.
 *
 * Version: v1.0.0
 * RPG Maker MZ Version: v1.6.1
 */

(() => {
  window.$oneVariable = {};

  const { variableId: _variableId } = PluginManager.parameters(
    document.currentScript.src.match(/^.*\/(.*).js$/)[1]
  );
  const variableId = Number(_variableId);

  const normalize = (value) => JSON.parse(JSON.stringify(value));
  const fromJSON = () => {
    if (variableId <= 0) throw new Error("変数を設定してください");
    try {
      const initValue = JSON.parse($gameVariables.value(variableId));
      if (typeof initValue !== "object") {
        $gameVariables.setValue(variableId, "{}");
        return {};
      }
      return initValue;
    } catch {
      $gameVariables.setValue(variableId, "{}");
      return {};
    }
  };

  window.$oneVariable.set = (key, value) => {
    const data = fromJSON();
    data[key] = normalize(value);
    $gameVariables.setValue(variableId, JSON.stringify(data));
  };
  window.$oneVariable.get = (key) => fromJSON()[key];
  window.$oneVariable.edit = (key, fn, defaultValue) => {
    const data = fromJSON();
    data[key] = normalize(fn(data[key] ?? defaultValue));
    $gameVariables.setValue(variableId, JSON.stringify(data));
  };
})();
