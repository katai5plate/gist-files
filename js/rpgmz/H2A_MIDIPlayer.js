/*:
 * @target MZ
 * @plugindesc MIDIファイルをBGMとして再生します。
 * @author Had2Apps
 *
 * @param fileExtension
 * @text MIDI拡張子
 * @desc 配置するMIDIファイルの拡張子。
 * @type select
 * @option mid
 * @value mid
 * @option midi
 * @value midi
 * @default mid
 *
 * @param generateVolume
 * @text MIDI生成音量
 * @desc PicoAudioのノート生成時の基準音量
 * @type number
 * @min 0
 * @decimals 3
 * @default 0.75
 *
 * @param titleBgm
 * @text タイトルBGM
 * @desc データベースのタイトルBGMをMIDIで上書き
 * @type struct<MidiBgm>
 * @default
 *
 * @param battleBgm
 * @text 戦闘BGM
 * @desc データベースの戦闘BGMをMIDIで上書き
 * @type struct<MidiBgm>
 * @default
 *
 * @param victoryMe
 * @text 勝利ME
 * @desc データベースの勝利MEをMIDIで上書き
 * @type struct<MidiMe>
 * @default
 *
 * @param defeatMe
 * @text 敗北ME
 * @desc データベースの敗北MEをMIDIで上書き
 * @type struct<MidiMe>
 * @default
 *
 * @param gameoverMe
 * @text ゲームオーバーME
 * @desc データベースのゲームオーバーMEをMIDIで上書き
 * @type struct<MidiMe>
 * @default
 *
 * @param boatBgm
 * @text 小型船BGM
 * @desc データベースの小型船BGMをMIDIで上書き
 * @type struct<MidiBgm>
 * @default
 *
 * @param shipBgm
 * @text 大型船BGM
 * @desc データベースの大型船BGMをMIDIで上書き
 * @type struct<MidiBgm>
 * @default
 *
 * @param airshipBgm
 * @text 飛行船BGM
 * @desc データベースの飛行船BGMをMIDIで上書き
 * @type struct<MidiBgm>
 * @default
 *
 * @command play
 * @text MIDI BGMの再生
 * @desc 指定したMIDIファイルをBGMとして再生します。通常BGMは停止します。
 *   @arg fileName
 *   @text ファイル名
 *   @desc audio/bgm/からの相対パスです。例: midi/op1（拡張子不要）
 *   @type string
 *   @arg volume
 *   @text 音量
 *   @type number
 *   @min 0
 *   @max 100
 *   @default 90
 *   @arg loop
 *   @text ループ再生
 *   @desc CC:111があれば、そこから局所ループします。
 *   @type boolean
 *   @default true
 *
 * @command stop
 * @text MIDI BGMの停止
 * @desc 再生中のMIDI BGMを停止します。
 *
 * @command playMe
 * @text MIDI MEの再生
 * @desc 指定したMIDIファイルをMEとして再生します。BGMはME終了後に再開します。
 *   @arg fileName
 *   @text ファイルパス
 *   @desc audio/me/からの相対パスです。例: midi/victory1（拡張子不要）
 *   @type string
 *   @arg volume
 *   @text 音量
 *   @type number
 *   @min 0
 *   @max 100
 *   @default 90
 *
 * @command setBattleBgm
 * @text 戦闘MIDI BGMの変更
 * @desc 以後の戦闘BGMを指定MIDIへ変更します。
 *   @arg fileName
 *   @text ファイル名
 *   @type string
 *   @arg volume
 *   @text 音量
 *   @type number
 *   @min 0
 *   @max 100
 *   @default 90
 *
 * @command setVehicleBgm
 * @text 乗り物MIDI BGMの変更
 * @desc 指定した乗り物のBGMをMIDIへ変更します。
 *   @arg vehicle
 *   @text 乗り物
 *   @type select
 *   @option 小型船
 *   @value boat
 *   @option 大型船
 *   @value ship
 *   @option 飛行船
 *   @value airship
 *   @default boat
 *   @arg fileName
 *   @text ファイル名
 *   @type string
 *   @arg volume
 *   @text 音量
 *   @type number
 *   @min 0
 *   @max 100
 *   @default 90
 *
 * @help
 * BGM用のMIDIファイルは audio/bgm/ 以下、ME用のMIDIファイルは audio/me/ 以下に
 * 配置してください。BGM欄・BGMコマンドにはaudio/bgm/からの相対パス、
 * ME欄・MEコマンドにはaudio/me/からの相対パスを指定します。
 * 例: audio/bgm/midi/op1.mid は midi/op1、audio/me/midi/victory1.mid は midi/victory1
 * MIDI拡張子はプラグイン設定で mid または midi を選択します。
 * MZのファイル選択UIはMIDIを選択できないため、パスは直接入力します。
 *
 * 通常BGMの開始時はMIDI BGMを停止し、MIDI BGMの開始時は通常BGMを停止します。
 * イベントコマンドの「BGMのフェードアウト」「BGMの保存」「BGMの再開」に対応します。
 * CC:111を含むMIDIは、CC:111の位置から局所ループします。
 * MIDI生成音量はPicoAudioの合成音量です。通常のBGM／ME音量とは別に調整します。
 * 和音の多いMIDIで値を上げすぎると、音割れが起こることがあります。
 *
 * PicoAudio.js 1.1.2 を同梱しています。
 * Copyright (c) 2017-2021 cagpie / Shun Kobayashi
 * Released under the MIT License.
 */

import { PicoAudio } from "./vendor/PicoAudio.js";

(() => {
  "use strict";

  const PLUGIN_NAME = "H2A_MIDIPlayer";
  const MIDI_PREFIX = "__H2A_MIDI__:";
  const parameters = PluginManager.parameters(PLUGIN_NAME);
  const midiExtension = parameters.fileExtension === "midi" ? "midi" : "mid";
  const configuredGenerateVolume = Number(parameters.generateVolume ?? "0.8");
  const generateVolume = Number.isFinite(configuredGenerateVolume)
    ? Math.max(0, configuredGenerateVolume)
    : 0.8;

  const parseStruct = (parameterName) => {
    const value = parameters[parameterName];
    if (!value) return {};
    try {
      return JSON.parse(value);
    } catch (error) {
      console.error(`${PLUGIN_NAME}: ${parameterName} の設定を読めません。`, error);
      return {};
    }
  };

  const normalizeMidiPath = (fileName, expectedFolder) => {
    const path = String(fileName || "")
      .trim()
      .replace(/\\/g, "/");
    if (
      !path ||
      /^audio\//i.test(path) ||
      /\.(mid|midi)$/i.test(path) ||
      path.split("/").some((segment) => !segment || segment === "." || segment === "..")
    ) {
      throw new Error(
        `${PLUGIN_NAME}: MIDIパスは拡張子を除いた audio/${expectedFolder}/ からの相対パスで指定してください。`
      );
    }
    return path;
  };

  const createMidiBgm = (fileName, volume = 90, loop = true, expectedFolder) => {
    const filePath = normalizeMidiPath(fileName, expectedFolder);
    const marker = `${MIDI_PREFIX}${expectedFolder}:${encodeURIComponent(filePath)}:${loop ? "1" : "0"}`;
    return {
      name: marker,
      volume: Number(volume) || 0,
      pitch: 100,
      pan: 0,
      pos: 0
    };
  };

  const parseMidiBgm = (bgm) => {
    if (!bgm?.name?.startsWith(MIDI_PREFIX)) return null;
    const [folder, encodedName, loopFlag] = bgm.name.slice(MIDI_PREFIX.length).split(":");
    try {
      if (folder !== "bgm" && folder !== "me") return null;
      return {
        folder,
        filePath: decodeURIComponent(encodedName),
        loop: loopFlag !== "0",
        volume: Number(bgm.volume) || 0,
        pitch: Number(bgm.pitch) || 100,
        pan: Number(bgm.pan) || 0,
        pos: Number(bgm.pos) || 0,
        marker: bgm.name
      };
    } catch (_error) {
      return null;
    }
  };

  const isMidiBgm = (bgm) => !!parseMidiBgm(bgm);

  const MidiPlayer = {
    _picoAudio: null,
    _current: null,
    _requestId: 0,

    isBgmPlaying() {
      return this._current?.kind === "bgm";
    },

    isMePlaying() {
      return this._current?.kind === "me";
    },

    isCurrentBgm(bgm) {
      return this.isBgmPlaying() && this._current.bgm.name === bgm.name;
    },

    currentBgm() {
      if (!this.isBgmPlaying()) return null;
      const bgm = { ...this._current.bgm };
      bgm.pos = this.position();
      return bgm;
    },

    position() {
      const current = this._current;
      if (!current) return 0;
      if (this._picoAudio?.states?.isPlaying) {
        return Math.max(
          0,
          this._picoAudio.context.currentTime - this._picoAudio.states.startTime
        );
      }
      return current.position;
    },

    updateVolume() {
      if (!this._current || !this._picoAudio) return;
      const bgmVolume = this._current.kind === "bgm" ? AudioManager.bgmVolume : AudioManager.meVolume;
      const masterVolume = WebAudio._masterVolume ?? 1;
      this._picoAudio.setMasterVolume(
        (this._current.bgm.volume / 100) * (bgmVolume / 100) * masterVolume
      );
    },

    _getPicoAudio() {
      if (!this._picoAudio) {
        this._picoAudio = new PicoAudio({
          audioContext: WebAudio._context,
          generateVolume
        });
        this._picoAudio.setCC111(true);
        this._picoAudio.addEventListener("songEnd", () => {
          if (this.isMePlaying()) this.finishMe();
        });
      }
      return this._picoAudio;
    },

    async playBgm(bgm, position = 0) {
      await this._play("bgm", bgm, position);
    },

    async playMe(me, fallbackBgm) {
      await this._play("me", me, 0, fallbackBgm);
    },

    async _play(kind, bgm, position, fallbackBgm = null) {
      const definition = parseMidiBgm(bgm);
      if (!definition) return;

      this.stop(false);
      const requestId = ++this._requestId;
      this._current = {
        kind,
        bgm: { ...bgm },
        position: Number(position) || 0,
        fallbackBgm
      };

      try {
        const url = `${AudioManager._path}${definition.folder}/${Utils.encodeURI(definition.filePath)}.${midiExtension}`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`${response.status} ${response.statusText}`);
        }
        const bytes = new Uint8Array(await response.arrayBuffer());
        if (requestId !== this._requestId || !this._current) return;

        const picoAudio = this._getPicoAudio();
        picoAudio.pause();
        picoAudio.initStatus();
        picoAudio.setData(picoAudio.parseSMF(bytes));
        picoAudio.setLoop(kind === "bgm" && definition.loop);
        picoAudio.setStartTime(this._current.position);
        this.updateVolume();
        picoAudio.play();
      } catch (error) {
        if (requestId === this._requestId) {
          console.error(`${PLUGIN_NAME}: MIDIを読み込めません (${definition.filePath})。`, error);
          if (kind === "me") {
            this.finishMe();
          } else {
            AudioManager._currentBgm = null;
            this._current = null;
          }
        }
      }
    },

    stop(clearCurrentBgm = true) {
      ++this._requestId;
      if (this._picoAudio?.states?.isPlaying) this._picoAudio.pause();
      const kind = this._current?.kind;
      this._current = null;
      if (clearCurrentBgm && kind === "bgm") AudioManager._currentBgm = null;
    },

    fadeOut(duration) {
      if (!this._current || !this._picoAudio?.masterGainNode) return;
      const current = this._current;
      const gain = this._picoAudio.masterGainNode.gain;
      const now = this._picoAudio.context.currentTime;
      gain.cancelScheduledValues(now);
      gain.setValueAtTime(gain.value, now);
      gain.linearRampToValueAtTime(0, now + duration);
      AudioManager._currentBgm = null;
      window.setTimeout(() => {
        if (this._current === current) this.stop(false);
      }, duration * 1000);
    },

    finishMe() {
      if (!this.isMePlaying()) return;
      const current = this._current;
      this.stop(false);
      AudioManager._meBuffer = null;
      const deferred = AudioManager._h2aDeferredMidiBgm;
      AudioManager._h2aDeferredMidiBgm = null;
      const resumeBgm = deferred || current.fallbackBgm;
      if (resumeBgm?.bgm) {
        AudioManager.playBgm(resumeBgm.bgm, resumeBgm.pos);
      }
    }
  };

  const _AudioManager_playBgm = AudioManager.playBgm;
  const _AudioManager_replayBgm = AudioManager.replayBgm;
  const _AudioManager_stopBgm = AudioManager.stopBgm;
  const _AudioManager_fadeOutBgm = AudioManager.fadeOutBgm;
  const _AudioManager_isCurrentBgm = AudioManager.isCurrentBgm;
  const _AudioManager_updateBgmParameters = AudioManager.updateBgmParameters;
  const _AudioManager_saveBgm = AudioManager.saveBgm;
  const _AudioManager_playMe = AudioManager.playMe;
  const _AudioManager_stopMe = AudioManager.stopMe;
  const _AudioManager_fadeOutMe = AudioManager.fadeOutMe;
  const _WebAudio_setMasterVolume = WebAudio.setMasterVolume;

  AudioManager.playBgm = function(bgm, pos) {
    if (MidiPlayer.isMePlaying()) {
      this._h2aDeferredMidiBgm = { bgm: { ...bgm }, pos: Number(pos) || 0 };
      this.updateCurrentBgm(bgm, pos);
      return;
    }
    if (this._meBuffer && isMidiBgm(bgm)) {
      this._h2aDeferredMidiBgm = { bgm: { ...bgm }, pos: Number(pos) || 0 };
      this.updateCurrentBgm(bgm, pos);
      return;
    }
    if (isMidiBgm(bgm)) {
      this.stopBgm();
      MidiPlayer.playBgm(bgm, pos);
      this.updateCurrentBgm(bgm, pos);
      return;
    }
    if (MidiPlayer.isBgmPlaying()) MidiPlayer.stop();
    return _AudioManager_playBgm.call(this, bgm, pos);
  };

  AudioManager.replayBgm = function(bgm) {
    if (isMidiBgm(bgm)) {
      if (MidiPlayer.isCurrentBgm(bgm)) {
        this.updateBgmParameters(bgm);
      } else {
        this.playBgm(bgm, bgm.pos);
      }
      return;
    }
    return _AudioManager_replayBgm.call(this, bgm);
  };

  AudioManager.stopBgm = function() {
    if (MidiPlayer.isBgmPlaying()) {
      MidiPlayer.stop();
      return;
    }
    return _AudioManager_stopBgm.call(this);
  };

  AudioManager.fadeOutBgm = function(duration) {
    if (MidiPlayer.isBgmPlaying()) {
      MidiPlayer.fadeOut(duration);
      return;
    }
    return _AudioManager_fadeOutBgm.call(this, duration);
  };

  AudioManager.isCurrentBgm = function(bgm) {
    if (isMidiBgm(bgm)) return MidiPlayer.isCurrentBgm(bgm);
    return _AudioManager_isCurrentBgm.call(this, bgm);
  };

  AudioManager.updateBgmParameters = function(bgm) {
    _AudioManager_updateBgmParameters.call(this, bgm);
    if (isMidiBgm(bgm)) MidiPlayer.updateVolume();
  };

  AudioManager.saveBgm = function() {
    return MidiPlayer.currentBgm() || _AudioManager_saveBgm.call(this);
  };

  AudioManager.playMe = function(me) {
    if (isMidiBgm(me)) {
      const fallbackBgm = this.saveBgm();
      this.stopMe();
      this.stopBgm();
      this._meBuffer = { h2aMidi: true };
      MidiPlayer.playMe(me, fallbackBgm.name ? { bgm: fallbackBgm, pos: fallbackBgm.pos } : null);
      return;
    }
    if (MidiPlayer.isBgmPlaying()) {
      this._h2aMidiResumeBgm = this.saveBgm();
      MidiPlayer.stop();
    }
    return _AudioManager_playMe.call(this, me);
  };

  AudioManager.stopMe = function() {
    if (MidiPlayer.isMePlaying()) {
      MidiPlayer.stop(false);
      this._meBuffer = null;
      return;
    }
    const hadMe = !!this._meBuffer;
    const result = _AudioManager_stopMe.call(this);
    if (hadMe) {
      const resumeBgm = this._h2aMidiResumeBgm;
      this._h2aMidiResumeBgm = null;
      if (resumeBgm?.name && !this._h2aDeferredMidiBgm) {
        this.replayBgm(resumeBgm);
      }
    }
    return result;
  };

  AudioManager.fadeOutMe = function(duration) {
    if (MidiPlayer.isMePlaying()) {
      MidiPlayer.fadeOut(duration);
      window.setTimeout(() => MidiPlayer.finishMe(), duration * 1000);
      return;
    }
    return _AudioManager_fadeOutMe.call(this, duration);
  };

  WebAudio.setMasterVolume = function(value) {
    _WebAudio_setMasterVolume.call(this, value);
    MidiPlayer.updateVolume();
  };

  const makeConfiguredBgm = (parameterName, loop, folder) => {
    const config = parseStruct(parameterName);
    return config.fileName
      ? createMidiBgm(config.fileName, config.volume, loop, folder)
      : null;
  };

  const applySystemOverrides = () => {
    const titleBgm = makeConfiguredBgm("titleBgm", true, "bgm");
    const battleBgm = makeConfiguredBgm("battleBgm", true, "bgm");
    const victoryMe = makeConfiguredBgm("victoryMe", false, "me");
    const defeatMe = makeConfiguredBgm("defeatMe", false, "me");
    const gameoverMe = makeConfiguredBgm("gameoverMe", false, "me");
    const boatBgm = makeConfiguredBgm("boatBgm", true, "bgm");
    const shipBgm = makeConfiguredBgm("shipBgm", true, "bgm");
    const airshipBgm = makeConfiguredBgm("airshipBgm", true, "bgm");

    if (titleBgm) $dataSystem.titleBgm = titleBgm;
    if (battleBgm) $dataSystem.battleBgm = battleBgm;
    if (victoryMe) $dataSystem.victoryMe = victoryMe;
    if (defeatMe) $dataSystem.defeatMe = defeatMe;
    if (gameoverMe) $dataSystem.gameoverMe = gameoverMe;
    if (boatBgm) $dataSystem.boat.bgm = boatBgm;
    if (shipBgm) $dataSystem.ship.bgm = shipBgm;
    if (airshipBgm) $dataSystem.airship.bgm = airshipBgm;
  };

  const _DataManager_onLoad = DataManager.onLoad;
  DataManager.onLoad = function(object) {
    _DataManager_onLoad.call(this, object);
    if (object === $dataSystem) applySystemOverrides();
  };

  PluginManager.registerCommand(PLUGIN_NAME, "play", (args) => {
    const bgm = createMidiBgm(args.fileName, args.volume, args.loop !== "false", "bgm");
    if (bgm) AudioManager.playBgm(bgm);
  });

  PluginManager.registerCommand(PLUGIN_NAME, "stop", () => {
    AudioManager.stopBgm();
  });

  PluginManager.registerCommand(PLUGIN_NAME, "playMe", (args) => {
    const me = createMidiBgm(args.fileName, args.volume, false, "me");
    if (me) AudioManager.playMe(me);
  });

  PluginManager.registerCommand(PLUGIN_NAME, "setBattleBgm", (args) => {
    const bgm = createMidiBgm(args.fileName, args.volume, true, "bgm");
    if (bgm) $gameSystem.setBattleBgm(bgm);
  });

  PluginManager.registerCommand(PLUGIN_NAME, "setVehicleBgm", (args) => {
    const bgm = createMidiBgm(args.fileName, args.volume, true, "bgm");
    const vehicle = $gameMap?.[args.vehicle]?.();
    if (bgm && vehicle) vehicle.setBgm(bgm);
  });
})();

/*~struct~MidiBgm:
 * @param fileName
 * @text ファイル名
 * @desc audio/bgm/からの相対パスです。例: midi/op1（拡張子不要）
 * @type string
 *
 * @param volume
 * @text 音量
 * @type number
 * @min 0
 * @max 100
 * @default 90
 */

/*~struct~MidiMe:
 * @param fileName
 * @text ファイル名
 * @desc audio/me/からの相対パスです。例: midi/victory1（拡張子不要）
 * @type string
 *
 * @param volume
 * @text 音量
 * @type number
 * @min 0
 * @max 100
 * @default 90
 */
