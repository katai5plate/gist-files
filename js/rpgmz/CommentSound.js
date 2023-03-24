/*:
 * @target MZ
 * @plugindesc 音声パス指定の頭に "// " があれば無視する
 */
(() => {
  const isCommentOut = (path) => /^\/\/\s/.test(path);
  const modifyAudioManager = (origin, argIndex = 0) =>
    function () {
      const args = [...arguments];
      if (isCommentOut(args[argIndex].name)) {
        args[argIndex].name = "";
      }
      return origin.apply(this, args);
    };

  AudioManager.playBgm = modifyAudioManager(AudioManager.playBgm);
  AudioManager.playBgs = modifyAudioManager(AudioManager.playBgs);
  AudioManager.playMe = modifyAudioManager(AudioManager.playMe);
  AudioManager.playSe = modifyAudioManager(AudioManager.playSe);
  AudioManager.playStaticSe = modifyAudioManager(AudioManager.playStaticSe);
  AudioManager.loadStaticSe = modifyAudioManager(AudioManager.loadStaticSe);
})();
