/* 
 * @plugindesc 足音
 * @param args
 * @type struct<arg>[]
 * 
 * @help
 * 並列処理で H2A_footstep.update()
 */
/*~struct~arg:
 * @param condition
 * @type select
 * @option regionId
 * @value "r"
 * @option terrainTag
 * @value "t"
 * @default "r"
 * 
 * @param conditionValue
 * @type number
 * @default 1
 * 
 * @param files
 * @type file[]
 * @dir audio/se
 * 
 * @param volumeMin
 * @type number
 * @min 0
 * @max 100
 * @default 100
 * 
 * @param volumeMax
 * @type number
 * @min 0
 * @max 100
 * @default 100
 * 
 * @param pitchMin
 * @type number
 * @min 50
 * @max 150
 * @default 50
 * 
 * @param pitchMax
 * @type number
 * @min 50
 * @max 150
 * @default 50
 * 
 * @param panMin
 * @type number
 * @min -150
 * @max 150
 * @default 0
 * 
 * @param panMax
 * @type number
 * @min -150
 * @max 150
 * @default 0
 * 
 * @param priority
 * @type number
 * @dsec rand:100 < X  (If only 1 then, 100%)
 * @default 100
 */

let H2A_footstep = {};

(() => {
  const pluginName = "H2A_footstep";
  const params = JSON.parse(
    JSON.stringify(PluginManager.parameters(pluginName), (k, v) => {
      try {
        return JSON.parse(v);
      } catch (k) {
        try {
          return eval(v);
        } catch (k) {
          return v;
        }
      }
    })
  );

  const randRange = (a, z) => Math.random() * (z - a) + a;

  H2A_footstep = {
    params: { ...params },
    prevStep: Number.NaN,
    update: function() {
      if (this.params.length === 0) return;
      if ($gameParty.steps() != this.prevStep) {
        this.prevStep = $gameParty.steps();
        this.params.forEach(item => {
          const {
            condition,
            conditionValue,
            files,
            volumeMin,
            volumeMax,
            pitchMin,
            pitchMax,
            panMin,
            panMax,
            priority
          } = item;
          const cond =
            (condition === "r"
              ? $gameMap.regionId($gamePlayer.x, $gamePlayer.y)
              : condition === "t"
                ? $gameMap.terrainTag($gamePlayer.x, $gamePlayer.y)
                : Number.NaN) === conditionValue;
          if (cond) {
            if (this.params.length === 1 || Math.random() * 100 < priority) {
              AudioManager.playSe({
                name: files[(Math.random() * files.length) >> 0],
                volume: randRange(volumeMin, volumeMax),
                pitch: randRange(pitchMin, pitchMax),
                pan: randRange(panMin, panMax)
              });
            }
          }
        });
      }
    }
  };
})();
