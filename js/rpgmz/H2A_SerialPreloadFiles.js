/*:
 * @target MZ
 * @plugindesc 直列プリロード
 * @author Had2Apps
 * @url https://had2apps.com/
 *
 * @command preload
 * @text 直列プリロード
 * @arg $files
 * @type file[]
 * @default []
 *
 * @help
 * 指定した素材がロードされるまでウェイトします。
 *
 * Copyright (c) 2023 Had2Apps
 * This software is released under the WTFPL License.
 */
(() => {
  const pluginName = document.currentScript.src.match(/^.*\/(.*).js$/)[1];

  const parsePath = (path) => {
    const parts = path.split("/");
    const base = parts[0];
    const folder = parts.slice(1, -1).join("/");
    const [name, ext] = parts.pop().split(".");
    return { base, folder, name, ext, path };
  };

  PluginManager.registerCommand(pluginName, "preload", function ({ $files }) {
    const LABEL = "preload";
    const IMAGE_EXT = ".png";
    const RETRY_MS = 1000 / 60;

    const files = JSON.parse($files).map((f) => parsePath(f));
    const loadedAudioPathList = [];

    this._waitCount = Number.MAX_SAFE_INTEGER;

    console.time(LABEL);

    files.forEach(({ base, folder, name, path }) => {
      if (base === "img") {
        return ImageManager.loadBitmap(`${base}/${folder}/`, name);
      }
      if (base === "audio") {
        const audio = AudioManager.createBuffer(`${folder}/`, name);
        audio.addLoadListener(() => {
          loadedAudioPathList.push(path);
        });
        return;
      }
      throw new Error("プリロード未対応のファイル形式: " + base);
    });

    const i = setInterval(() => {
      const isReady = files.reduce((_, { base, path }) => {
        if (base === "img") {
          return ImageManager._cache[path + IMAGE_EXT]?.isReady();
        }
        if (base === "audio") {
          return loadedAudioPathList.includes(path);
        }
      }, true);
      if (isReady) {
        this._waitCount = 0;
        console.timeEnd(LABEL);
        clearInterval(i);
      }
    }, RETRY_MS);
  });
})();
