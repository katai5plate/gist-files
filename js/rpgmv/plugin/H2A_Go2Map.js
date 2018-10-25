/*:
 * @plugindesc 場所移動拡張
 * @help
 * H2A_Go2Map.move(マップID, X座標, Y座標, <フェード=0>, <向き=0>);
 *   フェード： 0=black 1=white 2=none
 *   向き： 0=そのまま 2468=方角
 * H2A_Go2Map.find(キーワード, <検索方法=0>, <ソートコールバック>);
 *   返り値：マップID
 *   検索方法： 0～=部分検索のうちの候補番号 -1=完全一致検索
 *   ソートコールバック： .sort(この部分) 引数=a,b
 * 
 * H2A_Go2Map.move(H2A_Go2Map.find("ステージ"), 114, 514)
 *   ステージという名前が含まれる最初の候補のマップに移動
 */
let H2A_Go2Map = {};
(() => {
  H2A_Go2Map = {
    move: (mapID, x, y, fade = 0, dir = 0) => {
      $gamePlayer.reserveTransfer(mapID, x, y, dir, fade);
    },
    find: (name, mode = 0, sortCallBack = undefined) => {
      mode = mode >> 0;
      const res = $dataMapInfos.filter(v => {
        if (!!v) {
          if (mode !== -1) {
            return v.name.indexOf(name) > -1
          }
          return v.name === name;
        }
      }).sort(sortCallBack)[mode === -1 ? 0 : mode]
      if (typeof res === "undefined") {
        console.warn("Map not found");
        return null;
      }
      return res.id;
    }
  }
})()
