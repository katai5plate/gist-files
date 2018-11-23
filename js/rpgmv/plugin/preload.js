const $$$_PRELOAD_BGM_LIST = [];
const $$$_PRELOAD_BGS_LIST = [];
const $$$_PRELOAD_ME_LIST = [];
const $$$_PRELOAD_SE_LIST = [];
const $$$_PRELOAD_PICTURE_LIST = [];

(async () => {
  const sound_opt = {
    volume: 0,
    pitch: 1e2,
    pan: 0
  };
  const pic_opt = [0, 0, 0, 100, 100, 0, 0];
  const bgmp = () => new Promise(r => {
    const t = setInterval(() => {
      if (AudioManager._bgmBuffer && !!AudioManager._bgmBuffer._buffer) r(!0), clearInterval(t);
    }, 1);
  });
  const bgsp = () => new Promise(r => {
    const t = setInterval(() => {
      if (AudioManager._bgsBuffer && !!AudioManager._bgsBuffer._buffer) r(!0), clearInterval(t);
    }, 1);
  });
  const mep = () => new Promise(r => {
    const t = setInterval(() => {
      if (AudioManager._meBuffer && !!AudioManager._meBuffer._buffer) r(!0), clearInterval(t);
    }, 1);
  });
  const sep = () => new Promise(r => {
    const t = setInterval(() => {
      if (AudioManager._seBuffers && AudioManager._seBuffers.length !== 0) r(!0), clearInterval(t);
    }, 1);
  });
  const picp = () => new Promise(r => {
    const t = setInterval(() => {
      if ($gameScreen.picture(1) !== null) r(!0), clearInterval(t);
    }, 1);
  });

  console.log("___START-PRELOAD___");

  console.log("** BGM_PRELOAD-INIT", $$$_PRELOAD_BGM_LIST);
  for (let name of $$$_PRELOAD_BGM_LIST) {
    console.log(`BGM_PRELOAD-LOAD: ${name}`);
    AudioManager.playBgm({
      name,
      ...sound_opt
    });
    await bgmp();
    AudioManager.stopBgm();
    console.log(`BGM_PRELOAD-OK: ${name}`);
  }
  console.log("** BGM_PRELOAD-COMPLETE");

  console.log("** BGS_PRELOAD-INIT", $$$_PRELOAD_BGS_LIST);
  for (let name of $$$_PRELOAD_BGS_LIST) {
    console.log(`BGS_PRELOAD-LOAD: ${name}`);
    AudioManager.playBgs({
      name,
      ...sound_opt
    });
    await bgsp();
    AudioManager.stopBgs();
    console.log(`BGS_PRELOAD-OK: ${name}`);
  }
  console.log("** BGS_PRELOAD-COMPLETE");

  console.log("** ME_PRELOAD-INIT", $$$_PRELOAD_ME_LIST);
  for (let name of $$$_PRELOAD_ME_LIST) {
    console.log(`ME_PRELOAD-LOAD: ${name}`);
    AudioManager.playMe({
      name,
      ...sound_opt
    });
    await mep();
    AudioManager.stopMe();
    console.log(`ME_PRELOAD-OK: ${name}`);
  }
  console.log("** ME_PRELOAD-COMPLETE");

  console.log("** SE_PRELOAD-INIT", $$$_PRELOAD_SE_LIST);
  for (let name of $$$_PRELOAD_SE_LIST) {
    console.log(`SE_PRELOAD-LOAD: ${name}`);
    AudioManager.playSe({
      name,
      ...sound_opt
    });
    await sep();
    AudioManager.stopSe();
    console.log(`SE_PRELOAD-OK: ${name}`);
  }
  console.log("** SE_PRELOAD-COMPLETE");

  console.log("** PICTURE_PRELOAD-INIT", $$$_PRELOAD_SE_LIST);
  for (let name of $$$_PRELOAD_PICTURE_LIST) {
    console.log(`PICTURE_PRELOAD-LOAD: ${name}`);
    $gameScreen.showPicture(1, name, ...pic_opt);
    await picp();
    $gameScreen.erasePicture(1);
    console.log(`PICTURE_PRELOAD-OK: ${name}`);
  }
  console.log("** PICTURE_PRELOAD-COMPLETE");

  console.log("___FINISH-PRELOAD___");
})()
