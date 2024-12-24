/*:ja
 * @target MZ
 * @plugindesc マップイベントの名前とメモから直接JSを実行する
 * @author Had2Apps
 * @url https://github.com/katai5plate/RPGMakerPlugins
 * @help
 * 名前欄「Move#1,"two",{"three": 3}」（コメントと引数指定）
 * メモ欄「hogeFunc($1, $2, $3)」（実行するスクリプト）
 * イベントコマンド: スクリプト実行「$eventExcutor.do(this);」
 *
 * 上記のようにすることで、「hogeFunc(1,"two",{"three": 3})」が実行される。
 *
 * 名前欄の「#」の左辺はコメント部分なので、「#」以外は何を書いてもいい。
 * 名前欄の「#」の右辺はJSON配列として評価される。
 * メモ欄には実行させたいスクリプトを直接入力する。
 * $1, $2, $3 ... のように指定することで、引数指定が可能。
 *
 * Copyright (c) 2024-2025 Had2Apps
 * This software is released under the WTFPL License.
 */
(() => {
  const patch = (txt, arr) =>
    txt.replace(/\$(\d+)/g, (_, index) => arr[parseInt(index) - 1] ?? "");

  globalThis.$eventExcutor = {
    do: (interpreter) => {
      if (!(interpreter instanceof Game_Interpreter) || !interpreter?._eventId)
        throw new Error("不正な this が指定された");
      const { name, note } = $dataMap.events[interpreter._eventId];
      const args = name.split("#")?.[1] ?? null;
      if (args === null) throw new Error("名前欄のフォーマットが不正: " + name);
      let arr = [];
      try {
        arr = JSON.parse(`[${args}]`);
      } catch (error) {
        console.error("実行された引数:", args);
        throw new Error("名前欄の引数部のフォーマットが不正: " + error);
      }
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
