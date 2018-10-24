// var ValueID = 15;
// var Param = 2;
// var SoundNames = ["Blow1", "Crossbow", "Knock"];
// var VolumeMin = 100;
// var VolumeMax = 100; //    0 - 100
// var PitchMin = 100;
// var PitchMax = 100; //   50 - 150
// /* -------------------------------- */
// if ($gameVariables.value(ValueID) == Param) {
//   AudioManager.playSe({
//     name: SoundNames[Math.floor(Math.random() * SoundNames.length)],
//     volume: Math.floor(Math.random() * (VolumeMax - VolumeMin)) + VolumeMin,
//     pitch: Math.floor(Math.random() * (PitchMax - PitchMin)) + PitchMin,
//     pan: (this.character(-1).screenX() / SceneManager._screenWidth - 0.5) * 300
//   });
// }

// {"args":[{"condition":1,"conditionValue":1,"files":["Attack3","Battle1","Damage4"],"volumeMin":0,"volumeMax":1,"pitchMin":0,"pitchMax":1,"panMin":0,"panMax":1,"priority":1},{"condition":1,"conditionValue":2,"files":["Collapse4"],"volumeMin":1,"volumeMax":1,"pitchMin":1,"pitchMax":1,"panMin":1,"panMax":1,"priority":2}]}

/*:
 * @plugindesc 足音
 * @param args
 * @type struct<arg>[]
 */
/*~struct~arg:
 * @param condition
 * @type select
 * @option regionId
 * @value 1
 * @option terrainTag
 * @value 2
 * 
 * @param conditionValue
 * @type number
 * 
 * @param files
 * @type file[]
 * @dir audio/se
 * 
 * @param volumeMin
 * @type number
 * @param volumeMax
 * @type number
 * @param pitchMin
 * @type number
 * @param pitchMax
 * @type number
 * @param panMin
 * @type number
 * @param panMax
 * @type number
 * 
 * @param priority
 * @type number
 */

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
    console.log(params);
})()