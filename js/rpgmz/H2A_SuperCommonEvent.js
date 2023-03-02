/*:
 * @target MZ
 * @plugindesc コモンイベント強化
 * @author Had2Apps
 * @url https://had2apps.com
 *
 * @command exec
 * @text コモンイベントを呼ぶ
 * @desc 名前でコモンイベントを呼び出します。ID を紐づけずに呼ぶことにより、後からコモンイベントを並べ替えることができます。
 *   @arg name
 *     @text イベント名
 *   @arg argValue
 *     @text 引数(JSON)
 *     @type multiline_string
 *     @default {}
 *     @desc 呼び出し先で this.getArg() で読むことができます。呼ぶ度に上書きされるため、値を変数などに退避するなどしてください　。
 *
 * @command defineCommonEvent
 * @text コモンイベント初期設定
 * @desc これをコモンイベントの最初に設定することで発火条件を設定できます。
 *   @arg condition
 *     @text 実行条件(JS)
 *   @arg isParallel
 *     @text 並列実行か
 *     @default false
 *     @type boolean
 *       @on 並列実行
 *       @off 自動実行
 *
 * @command defineMapEventPage
 * @text マップイベントページ初期設定
 * @desc マップイベントのページの出現条件を「コモンイベント初期設定」と同様に設定できます。
 *   @arg condition
 *     @text 実行条件(JS)
 *
 * @command updateMapEvents
 * @text マップイベント更新
 * @desc 「マップイベントページ初期設定」を即座に反映させます。
 *
 * @help
 * コモンイベントの機能を強化します。
 *
 * ・コモンイベントの発火条件をスクリプトで設定できるようにする
 *
 * コモンイベントの「最初」のイベントコマンドに、
 * プラグインコマンド「コモンイベント初期設定」を設定してください。
 * トリガーのプルダウンは「なし」のままにしてください。
 *
 * ・コモンイベントを名前指定で呼べるようにする
 *
 * プラグインコマンド「コモンイベントを呼ぶ」から実行してください。
 * プラグインコマンド名が被っていたり、
 * 指定したコモンイベントが存在しない場合、エラーになります。
 *
 * ・コモンイベント実行時に引数を与えられるようにする
 *
 * プラグインコマンド「コモンイベントを呼ぶ」で引数を付与することができます。
 * 受け取り先のコモンイベントで、スクリプト「this.getArg()」から値を得ることができます。
 * ただし、プラグインコマンド「コモンイベントを呼ぶ」が呼ばれるたびに、値が上書きされてしまうため、
 * 受け取ったらすぐ変数に格納するなどしてください。
 *
 * ・（上級）マップイベントのページの出現条件をスクリプトで設定できるようにする
 *
 * 「最初」のイベントコマンドに、
 * プラグインコマンド「マップイベントページ初期設定」を設定してください。
 * 設定すると「出現条件」がすべて無効になります。
 * ツクールの仕様上常時監視ではないため、変数やスイッチなどが更新されない限り、
 * 条件が反映されることはありません。
 *
 * そのため、決まったタイミングに即座に反映させたい場合は、
 * プラグインコマンド「マップイベント更新」を実行してください。
 *
 *
 * Copyright (c) 2023 Had2Apps
 * This software is released under the MIT License.
 *
 * Version: v1.2.0
 * RPG Maker MZ Version: v1.6.1
 */
(() => {
  const PLUGIN_NAME = document.currentScript.src.match(/^.*\/(.*).js$/)[1];

  /** コモンイベントの引数を一時保管する変数 */
  let execArgState = {};
  // コモンイベント呼び出し
  PluginManager.registerCommand(PLUGIN_NAME, "exec", (args) => {
    if (!args?.name) throw new Error("コモンイベント名が指定されていません");
    const commonEvents = $dataCommonEvents.filter((c) => c?.name === args.name);
    if (commonEvents.length > 1)
      throw new Error(
        `同じ名前のコモンイベントがあります。名前が被らないようにしてください: ${
          args?.name
        } = ${commonEvents.map((x) => x.id).join(", ")}`
      );
    const [commonEvent] = commonEvents;
    if (commonEvent) {
      if (args?.argValue) {
        execArgState = JSON.parse(args.argValue);
      }
      return $gameTemp.reserveCommonEvent(commonEvent.id);
    }
    throw new Error(`コモンイベントがありません: ${args.name}`);
  });
  Game_Interpreter.prototype.getArg = () => execArgState;

  // マップイベント更新
  PluginManager.registerCommand(PLUGIN_NAME, "updateMapEvents", () => {
    $gameMap.requestRefresh();
  });

  /** 設定付きコモンイベントか判定し、有効ならデータを返す */
  const isSuperCommonEvent = (commonEvent) => {
    const { parameters } = commonEvent?.list?.[0] ?? {};
    if (parameters?.length) {
      const [pluginName, commandName, _, args] = parameters;
      if (
        pluginName?.match?.(PLUGIN_NAME) &&
        ["defineCommonEvent", "defineMapEventPage"].includes(commandName)
      ) {
        const { condition, isParallel } = args;
        return {
          /** コモンイベントの生データ */
          event: commonEvent,
          /** これが TRUE なら自動・並列実行される */
          on: () => eval(condition),
          /** 数値型のトリガー値 */
          trueTrigger: isParallel === "true" ? 2 : 1,
        };
      }
    }
    return null;
  };

  // 自動実行コモンイベントを取得
  Game_Map.prototype.autorunCommonEvents = function () {
    return $dataCommonEvents.filter(
      (commonEvent) =>
        commonEvent?.trigger === 1 ||
        isSuperCommonEvent(commonEvent)?.trueTrigger === 1
    );
  };
  // 並列実行コモンイベントを取得
  Game_Map.prototype.parallelCommonEvents = function () {
    return $dataCommonEvents.filter(
      (commonEvent) =>
        commonEvent?.trigger === 2 ||
        isSuperCommonEvent(commonEvent)?.trueTrigger === 2
    );
  };

  // 自動実行条件設定
  const _Game_Map_prototype_setupAutorunCommonEvent =
    Game_Map.prototype.setupAutorunCommonEvent;
  Game_Map.prototype.setupAutorunCommonEvent = function () {
    for (const commonEvent of this.autorunCommonEvents()) {
      const superCommonEvent = isSuperCommonEvent(commonEvent);
      if (superCommonEvent.on()) {
        this._interpreter.setup(superCommonEvent.event.list);
        return true;
      }
    }
    return _Game_Map_prototype_setupAutorunCommonEvent.apply(this, arguments);
  };
  // 並列実行条件設定
  const _Game_CommonEvent_prototype_isActive =
    Game_CommonEvent.prototype.isActive;
  Game_CommonEvent.prototype.isActive = function () {
    return (
      isSuperCommonEvent(this.event()).on() ||
      _Game_CommonEvent_prototype_isActive.apply(this, arguments)
    );
  };

  // 通常の呼び出しに警告を出す
  const _Game_Interpreter_prototype_command117 =
    Game_Interpreter.prototype.command117;
  Game_Interpreter.prototype.command117 = function () {
    console.warn(
      "コモンイベントを ID 指定しています！並べ替え等ができなくなるため、使用を避けてください。"
    );
    return _Game_Interpreter_prototype_command117.apply(this, arguments);
  };

  // ページの発火条件設定（マップイベントページ初期設定）
  const _Game_Event_prototype_meetsConditions =
    Game_Event.prototype.meetsConditions;
  Game_Event.prototype.meetsConditions = function (page) {
    const superEvent = isSuperCommonEvent(page);
    return superEvent
      ? superEvent?.on()
      : _Game_Event_prototype_meetsConditions.apply(this, arguments);
  };
})();
