/*:ja
 * @target MZ
 * @plugindesc マップイベントの名前とメモから直接JSを実行する
 * @author Had2Apps
 * @url https://github.com/katai5plate/RPGMakerPlugins
 * @help
 * マップイベントで $eventExcutor.do(this); をスクリプト実行することで、
 * 名前欄、メモ欄に書かれたスクリプト内容を実行してくれる、中級者向けプラグイン。
 *
 * 例えば、
 * 名前欄「Chikuwa#1,"two",{"three": 3}」
 * メモ欄「console.log($1, $2, $3)」
 * のように入力すると、「$eventExecutor.do(this);」のタイミングで
 * 「console.log(1, "two", {"three": 3})」が実行される。
 * （「#」の左側にある「Chikuwa」の部分はコメントとして処理されるので、「#」以外なら何を書いてもいい）
 *
 * Copyright (c) 2024-2025 Had2Apps
 * This software is released under the WTFPL License.
 */
(() => {
  const patch = (txt, arr) =>
    txt.replace(/\$(\d+)/g, (_, index) => arr[parseInt(index) - 1] ?? "");

  globalThis.$eventExecutor = {
    do: (interpreter) => {
      if (!(interpreter instanceof Game_Interpreter) || !interpreter?._eventId)
        throw new Error("不正な this が指定された");
      const { name, note } = $dataMap.events[interpreter._eventId];
      const args = name.split("#")?.[1] ?? null;
      if (args === null) throw new Error("名前欄のフォーマットが不正: " + name);
      const arr = args.split(",");
      const code = patch(note, arr);
      try {
        eval(code);
      } catch (error) {
        console.error("実行されたコード:", code);
        throw new Error("メモ欄のスクリプト実行エラー: " + error);
      }
    },
  };
})();
