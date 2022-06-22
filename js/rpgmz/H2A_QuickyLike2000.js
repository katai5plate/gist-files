/*:ja
 * @target MZ
 * @plugindesc 2000 の頃みたいにキビキビ動かします
 * @author Had2Apps
 * @url https://github.com/katai5plate/RPGMakerPlugins
 * @help
 * Copyright (c) 2022 Had2Apps
 * This software is released under the WTFPL License.
 */
(() => {
  // アニメーションを 2 倍速
  const animeUpdateMV = Sprite_AnimationMV.prototype.update;
  Sprite_AnimationMV.prototype.update = function () {
    animeUpdateMV.apply(this);
    animeUpdateMV.apply(this);
  };
  const animeUpdateMZ = Sprite_Animation.prototype.update;
  Sprite_Animation.prototype.update = function () {
    animeUpdateMZ.apply(this);
    animeUpdateMZ.apply(this);
  };
  // 歩行速度を倍にする
  const distancePerFrame = Game_CharacterBase.prototype.distancePerFrame;
  Game_CharacterBase.prototype.distancePerFrame = function () {
    return distancePerFrame.apply(this) * 2;
  };
})();
