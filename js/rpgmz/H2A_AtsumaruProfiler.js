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
 * の情報を「グローバルシグナル API」を使用して収集します。
 *
 * アツマール上で使用する時は、コンソールを開いてください。
 *
 * [特定のイベントで発火]
 * window.$analytics.setLog("FLGNM");
 *
 * この FLGNM のところに、5文字の半角英数で識別子を入力してください。
 *
 * [結果を見る]
 * window.$analytics.getLogs();
 *
 * これを制作者にしかわからないような所でのみ実行できるようにしてください。
 *
 * ---
 * Copyright (c) 2022 Had2Apps
 * This software is released under the WTFPL License.
 */
(async () => {
  const { _whiteList } = PluginManager.parameters(
    document.currentScript.src.match(/^.*\/(.*).js$/)[1]
  );
  const IGNORE_ID = JSON.parse(_whiteList ?? []).map(Number);

  const zerone = (x) => (!!x ? 1 : 0);
  const gifpo = (x) => `${Math.floor(x / 100)}`.slice(0, 5);
  window.$analytics = {
    IGNORE_ID,
    state: {
      id: null,
      isPremium: null,
      giftTable: {},
    },
    getLogs() {
      console.log("loading...");
      window.RPGAtsumaru?.signal.getGlobalSignals().then((signals) => {
        console.log(
          "----- ACCESS LOGS -----",
          signals.map(({ senderId, senderName, data, createdAt }) => ({
            userId: senderId,
            userName: senderName,
            at: new Date(createdAt * 1000).toLocaleString(),
            flag: data.match(/^f(.*?)mobil/)?.[1],
            isMobile: /mobil1/.test(data),
            isAndroidChrome: /mobil\dandch1/.test(data),
            isMobileSafari: /mobil\dandch\diossf1/.test(data),
            allGift:
              (data.match(/mobil\dandch\diossf\dallgf(\d+)/)?.[1] ?? 0) * 100,
            _gift: (data.match(/nowgf(\d+)/)?.[1] ?? 0) * 100,
            _comment: data.match(/cmmnt(.*?)$/)?.[1],
          })),
          signals,
          window.$analytics.state
        );
      });
    },
    async sendLog(flag = "#####", point = -1, comment = "") {
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
  if (!!window.RPGAtsumaru) {
    try {
      const { id, isPremium } =
        await window.RPGAtsumaru.user.getSelfInformation();
      const giftTable = await window.RPGAtsumaru.gift.getMyPoints();
      window.$analytics.state.id = id;
      window.$analytics.state.isPremium = isPremium;
      window.$analytics.state.giftTable = giftTable;
      if (IGNORE_ID.includes(id)) {
        console.log("WELCOME HOME, OWNER!");
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
