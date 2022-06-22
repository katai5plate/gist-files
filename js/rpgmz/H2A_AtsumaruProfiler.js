/*:ja
 * @target MZ
 * @plugindesc コメントした人の情報を収集します
 * @author Had2Apps
 * @url https://github.com/katai5plate/RPGMakerPlugins
 *
 * @param _whiteList
 * @text ホワイトリスト
 * @desc プロファイリングの洗礼を受けないユーザーのIDリスト
 * @type number[]
 *
 * @help
 * アツマールにログイン済のユーザーのうち、
 * ・ゲームにアクセスした人
 * ・特定のイベントを見た人
 * ・特定のコメントを書いた人
 * ・エラーが発生した人
 * の情報を「グローバルシグナル API」を使用して収集します。
 *
 * アツマール上で使用する時は、コンソールを開いてください。
 *
 * [ホワイトリストのメンバーか判別する]
 * window.$analytics.isOwner();
 *
 * [特定のイベントログを記録]
 * window.$analytics.setLog("FLGNM");
 *
 * この FLGNM のところに、5文字の半角英数で識別子を入力してください。
 * 様々な場面に散りばめることで、ユーザーの行動パターンを分析しやすくなります。
 *
 * [結果を見る]
 * window.$analytics.getLogs();
 *
 * これを制作者にしかわからないような所でのみ実行できるようにしてください。
 * 絶対に誰にも見られたくない場合は次のように書くといいでしょう。
 *
 * if(window.$analytics.isOwner()){
 *   window.$analytics.getLogs();
 * }
 *
 * version: プラグインバージョン
 * userId: ユーザーID
 * userName: ユーザー名
 * at: ログ日時
 * flag: ログ識別子("#####" は入室時、 "#cmt#" はコメント時, "#err#" はエラー時)
 * isMobile: スマホかどうか
 * isAndroidChrome: Android で Chrome を使っているかどうか
 * isMobileSafari: iOS で Safari を使っているかどうか
 * isPremium: プレミアム会員か
 * usedMouse: ある程度マウスを使ったか
 * usedKeyboard: ある程度キーボードを使ったか
 * usedController: ある程度アツマールのコントローラーを使ったか
 * allGift: このゲームへギフト課金した総額
 * _gift: このタイミングで課金したギフト額
 * _comment: このタイミングで発言したコメントの一部
 *
 * ---
 * Copyright (c) 2022 Had2Apps
 * This software is released under the WTFPL License.
 */
(async () => {
  // プラグインのバージョン(必ず [0-9, 0-9, 0-9])
  const VERSION = [1, 2, 1];

  const { _whiteList } = PluginManager.parameters(
    document.currentScript.src.match(/^.*\/(.*).js$/)[1]
  );
  const IGNORE_ID = _whiteList ? JSON.parse(_whiteList).map(Number) : [];

  const zerone = (x) => (!!x ? 1 : 0);
  const gifpo = (x) => `${Math.floor(x / 100)}`.slice(0, 5);

  window.$analytics = {
    IGNORE_ID,
    state: {
      id: null,
      isPremium: null,
      giftTable: {},
      touchCount: 0,
      keyCount: 0,
      padCount: 0,
      isOwner: false,
    },
    isOwner() {
      return window.$analytics.state.isOwner;
    },
    getLogs() {
      console.log("loading...");
      window.RPGAtsumaru?.signal.getGlobalSignals().then((signals) => {
        console.log(
          "----- ACCESS LOGS -----",
          signals.map(({ senderId, senderName, data, createdAt }) => ({
            version: [...(data.match(/ver(\d{3})/)?.[1] || "")].join("."),
            userId: senderId,
            userName: senderName,
            at: new Date(createdAt * 1000).toLocaleString(),
            flag: data.match(/^f(.*?)mobil/)?.[1],
            isMobile: /mobil1/.test(data),
            isAndroidChrome: /andch1/.test(data),
            isMobileSafari: /iossf1/.test(data),
            isPremium: /prmum1/.test(data),
            usedMouse: /touch1/.test(data),
            usedKeyboard: /keybd1/.test(data),
            usedController: /agmpd1/.test(data),
            allGift: (data.match(/allgf(\d+)/)?.[1] ?? 0) * 100,
            _gift: (data.match(/nowgf(\d+)/)?.[1] ?? 0) * 100,
            _comment: data.match(/cmmnt(.*?)$/)?.[1],
          })),
          signals,
          window.$analytics.state
        );
      });
    },
    async sendLog(flag = "#####", point = 0, comment = "") {
      if (IGNORE_ID.includes(window.$analytics.state.id)) {
        console.log({ flag, point, comment });
        return;
      }
      try {
        await window.RPGAtsumaru.signal.sendSignalToGlobal(
          `${
            Object.entries({
              // +6
              f: flag.slice(0, 5),
              // +6
              mobil: zerone(Utils.isMobileDevice()),
              // +6
              andch: zerone(Utils.isAndroidChrome()),
              // +6
              iossf: zerone(Utils.isMobileSafari()),
              // +6
              prmum: zerone(window.$analytics.state.isPremium),
              // +6
              touch: zerone(window.$analytics.state.touchCount > 100),
              // +6
              keybd: zerone(window.$analytics.state.keyCount > 100),
              // +6
              agmpd: zerone(!!window.$analytics.state.padCount),
              // +6
              ver: VERSION.join("").slice(0, 3),
              // +10
              allgf: gifpo(
                Object.values(window.$analytics.state.giftTable || {}).reduce(
                  (p, c) => p + c,
                  0
                )
              ),
              // +10
              nowgf: gifpo(point ?? 0),
              // +20
              cmmnt: `${comment ?? ""}`.slice(0, 20),
            })
              .map(([k, v]) => `${k}${v}`)
              .join("") //
          }`
        );
      } catch (error) {
        console.warn(error);
      }
    },
  };

  const touchIsPressed = TouchInput.isPressed;
  TouchInput.isPressed = function () {
    const result = touchIsPressed.apply(this);
    if (result) {
      window.$analytics.state.touchCount++;
    }
    return result;
  };
  const keyIsPressed = Input.isPressed;
  Input.isPressed = function () {
    const result = keyIsPressed.apply(this, arguments);
    if (result) {
      window.$analytics.state.keyCount++;
    }
    return result;
  };
  const onError = SceneManager.onError;
  SceneManager.onError = function (event) {
    window.$analytics.sendLog(
      "#err#",
      0,
      event.message.split(":").slice(-1)?.[0]?.replaceAll(" ", "") ??
        event.message
    );
    onError.apply(this, arguments);
  };

  if (!!window.RPGAtsumaru) {
    try {
      const { id, isPremium } =
        await window.RPGAtsumaru.user.getSelfInformation();
      const giftTable = await window.RPGAtsumaru.gift.getMyPoints();
      window.$analytics.state.id = id;
      window.$analytics.state.isPremium = isPremium;
      window.$analytics.state.giftTable = giftTable;
      window.RPGAtsumaru.controllers.defaultController.subscribe(() => {
        window.$analytics.state.padCount++;
      });
      if (IGNORE_ID.includes(id)) {
        console.log("WELCOME HOME, OWNER!");
        window.$analytics.state.isOwner = true;
        window.RPGAtsumaru.comment.verbose = true;
        window.RPGAtsumaru.comment.cameOut.subscribe((comments) => {
          console.log(
            "COMMENT",
            comments.map(
              ({ comment, userName, createdAt, point, thanks, reply }) => ({
                comment,
                userName,
                at: new Date(createdAt * 1000).toLocaleString(),
                point,
                thanks,
                reply,
              })
            )
          );
        });
        return;
      }
      window.RPGAtsumaru.comment.posted.subscribe(
        async ({ point, comment }) => {
          try {
            await window.$analytics.sendLog("#cmt#", point, comment);
          } catch (error) {
            console.warn(error);
          }
        }
      );
      await window.$analytics.sendLog();
    } catch (error) {
      console.warn(error);
    }
  }
})();
