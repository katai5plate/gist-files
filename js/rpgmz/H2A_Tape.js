/*:
 * @target MZ
 * @plugindesc 再生中のBGMをテープストップ・テープスタートします。
 * @author Had2Apps
 *
 * @param stopDuration
 * @text テープストップ時間
 * @desc テープストップにかける秒数です。
 * @type number
 * @min 0.1
 * @decimals 2
 * @default 1.00
 *
 * @param startDuration
 * @text テープスタート時間
 * @desc テープスタートにかける秒数です。
 * @type number
 * @min 0.1
 * @decimals 2
 * @default 1.00
 *
 * @param stopEasing
 * @text テープストップのイージング
 * @desc 減速方法です。
 * @type select
 * @option 線形
 * @value 0
 * @option ゆっくり開始
 * @value 1
 * @option ゆっくり終了
 * @value 2
 * @option ゆっくり開始&終了
 * @value 3
 * @default 0
 *
 * @param startEasing
 * @text テープスタートのイージング
 * @desc 加速方法です。
 * @type select
 * @option 線形
 * @value 0
 * @option ゆっくり開始
 * @value 1
 * @option ゆっくり終了
 * @value 2
 * @option ゆっくり開始&終了
 * @value 3
 * @default 0
 *
 * @command tapeStop
 * @text テープストップ
 * @desc 再生中のBGMを減速させて停止します。
 *   @arg duration
 *   @text 時間
 *   @desc 秒数です。0ならプラグイン設定の値を使います。
 *   @type number
 *   @min 0
 *   @decimals 2
 *   @default 0
 *   @arg easing
 *   @text イージング
 *   @desc 減速方法です。「設定値」を選ぶとプラグイン設定の値を使います。
 *   @type select
 *   @option 設定値
 *   @value default
 *   @option 線形
 *   @value 0
 *   @option ゆっくり開始
 *   @value 1
 *   @option ゆっくり終了
 *   @value 2
 *   @option ゆっくり開始&終了
 *   @value 3
 *   @default default
 *
 * @command tapeStart
 * @text テープスタート
 * @desc 指定BGM、またはテープストップしたBGMを加速再生します。
 *   @arg fileName
 *   @text BGMファイル
 *   @desc 指定時はこのBGMをテープスタートします。空欄なら停止位置から再開します。
 *   @type file
 *   @dir audio/bgm
 *   @default
 *   @arg volume
 *   @text 音量
 *   @type number
 *   @min 0
 *   @max 100
 *   @default 90
 *   @arg pitch
 *   @text ピッチ
 *   @type number
 *   @min 50
 *   @max 150
 *   @default 100
 *   @arg pan
 *   @text 位相
 *   @type number
 *   @min -100
 *   @max 100
 *   @default 0
 *   @arg duration
 *   @text 時間
 *   @desc 秒数です。0ならプラグイン設定の値を使います。
 *   @type number
 *   @min 0
 *   @decimals 2
 *   @default 0
 *   @arg easing
 *   @text イージング
 *   @desc 加速方法です。「設定値」を選ぶとプラグイン設定の値を使います。
 *   @type select
 *   @option 設定値
 *   @value default
 *   @option 線形
 *   @value 0
 *   @option ゆっくり開始
 *   @value 1
 *   @option ゆっくり終了
 *   @value 2
 *   @option ゆっくり開始&終了
 *   @value 3
 *   @default default
 *
 * @help
 * 再生中の通常BGMにテープストップをかけ、停止位置からテープスタートできます。
 * テープスタートでBGMファイルを指定すると、BGM未再生時にもその曲をテープスタートできます。
 * BGMが切り替わった後やME再生中には、停止前のBGMを誤って再開しません。
 * テープストップ中にテープスタートすると、減速を取り消して加速再生に切り替えます。
 * イージングはツクールMZのピクチャ移動と同じ4種類から選べます。
 *
 * このプラグインの開発には、Codex AI が使用されています。
 * Copyright (c) 2026 Had2Apps
 * This software is released under the WTFPL License.
 */
(function() {
  "use strict";
  (() => {
    const PLUGIN_NAME = "H2A_Tape";
    const parameters = PluginManager.parameters(PLUGIN_NAME);
    const defaultStopDuration = Math.max(0.1, Number(parameters.stopDuration) || 1);
    const defaultStartDuration = Math.max(0.1, Number(parameters.startDuration) || 1);
    const defaultStopEasing = [0, 1, 2, 3].includes(Number(parameters.stopEasing)) ? Number(parameters.stopEasing) : 0;
    const defaultStartEasing = [0, 1, 2, 3].includes(Number(parameters.startEasing)) ? Number(parameters.startEasing) : 0;
    const EASING_STEPS = 60;
    const resolveDuration = (value, fallback) => {
      const duration = Number(value);
      return Number.isFinite(duration) && duration > 0 ? duration : fallback;
    };
    const resolveEasing = (value, fallback) => {
      const easing = Number(value);
      return Number.isInteger(easing) && easing >= 0 && easing <= 3 ? easing : fallback;
    };
    const calcEasing = (time, easingType) => {
      time = Math.max(0, Math.min(1, time));
      switch (easingType) {
        case 1:
          return time * time;
        case 2:
          return 1 - (1 - time) * (1 - time);
        case 3:
          return time < 0.5 ? 2 * time * time : 1 - 2 * (1 - time) * (1 - time);
        default:
          return time;
      }
    };
    const easingArea = (easingType) => {
      let area = 0;
      for (let index = 1; index <= EASING_STEPS; index++) {
        const before = calcEasing((index - 1) / EASING_STEPS, easingType);
        const after = calcEasing(index / EASING_STEPS, easingType);
        area += (before + after) / 2 / EASING_STEPS;
      }
      return area;
    };
    const numberInRange = (value, fallback, min, max) => {
      const number = Number(value);
      const resolved = Number.isFinite(number) ? number : fallback;
      return Math.max(min, Math.min(max, resolved));
    };
    const createBgm = (args) => {
      const name = String(args.fileName || "").trim();
      if (!name) return null;
      return {
        name,
        volume: numberInRange(args.volume, 90, 0, 100),
        pitch: numberInRange(args.pitch, 100, 50, 150),
        pan: numberInRange(args.pan, 0, -100, 100),
        pos: 0
      };
    };
    const Tape = {
      _state: null,
      _pendingStart: null,
      _serial: 0,
      currentBgm() {
        var _a;
        const buffer = AudioManager._bgmBuffer;
        const bgm = AudioManager._currentBgm;
        if (!buffer || !bgm || AudioManager._meBuffer || !((_a = buffer._sourceNodes) == null ? void 0 : _a.length) || !WebAudio._context) {
          return null;
        }
        return { buffer, bgm: { ...bgm } };
      },
      schedulePlaybackRate(buffer, from, to, duration, easingType) {
        var _a, _b;
        const now = (_a = WebAudio._context) == null ? void 0 : _a.currentTime;
        if (!Number.isFinite(now) || !((_b = buffer == null ? void 0 : buffer._sourceNodes) == null ? void 0 : _b.length)) return false;
        for (const sourceNode of buffer._sourceNodes) {
          const rate = sourceNode.playbackRate;
          rate.cancelScheduledValues(now);
          rate.setValueAtTime(from, now);
          for (let step = 1; step <= EASING_STEPS; step++) {
            const time = step / EASING_STEPS;
            const value = from + (to - from) * calcEasing(time, easingType);
            rate.linearRampToValueAtTime(value, now + duration * time);
          }
        }
        return true;
      },
      tapeStop(duration, easingType) {
        var _a;
        if (((_a = this._state) == null ? void 0 : _a.phase) === "stopping") return;
        const current = this.currentBgm();
        if (!current) return;
        const bgm = AudioManager.saveBgm();
        if (!(bgm == null ? void 0 : bgm.name)) return;
        const baseRate = current.buffer._pitch || 1;
        const startPosition = current.buffer.seek();
        const serial = ++this._serial;
        const state = {
          phase: "stopping",
          serial,
          buffer: current.buffer,
          bgm,
          baseRate,
          startPosition,
          startTime: WebAudio._context.currentTime,
          duration,
          easingType
        };
        this._state = state;
        if (!this.schedulePlaybackRate(current.buffer, baseRate, 0, duration, easingType)) {
          this._state = null;
          return;
        }
        window.setTimeout(() => {
          if (this._state !== state || state.serial !== this._serial || AudioManager._bgmBuffer !== state.buffer) {
            return;
          }
          const playedRatio = 1 - easingArea(state.easingType);
          state.bgm.pos = state.startPosition + state.baseRate * state.duration * playedRatio;
          AudioManager.stopBgm();
          state.phase = "stopped";
        }, duration * 1e3);
      },
      tapeStart(duration, easingType, specifiedBgm = null) {
        if (specifiedBgm) {
          this.tapeStartBgm(specifiedBgm, duration, easingType);
          return;
        }
        const state = this._state;
        if (!state) return;
        if (state.phase === "stopping") {
          if (AudioManager._bgmBuffer !== state.buffer) {
            this._state = null;
            return;
          }
          const elapsed = WebAudio._context.currentTime - state.startTime;
          const currentRate = Math.max(
            0,
            state.baseRate * (1 - calcEasing(elapsed / state.duration, state.easingType))
          );
          ++this._serial;
          this._state = null;
          this.schedulePlaybackRate(
            state.buffer,
            currentRate,
            state.baseRate,
            duration,
            easingType
          );
          return;
        }
        if (state.phase !== "stopped") return;
        if (AudioManager._bgmBuffer || AudioManager._currentBgm || AudioManager._meBuffer) {
          this._state = null;
          return;
        }
        const bgm = { ...state.bgm };
        this._state = null;
        this._pendingStart = { name: bgm.name, duration, easingType };
        AudioManager.playBgm(bgm, bgm.pos);
        this.applyPendingStart(AudioManager._bgmBuffer);
      },
      tapeStartBgm(bgm, duration, easingType) {
        ++this._serial;
        this._state = null;
        this._pendingStart = { name: bgm.name, duration, easingType };
        AudioManager.playBgm(bgm, 0);
        this.applyPendingStart(AudioManager._bgmBuffer);
      },
      applyPendingStart(buffer) {
        var _a;
        const pending = this._pendingStart;
        if (!pending || !buffer || buffer.name !== pending.name) return;
        if (AudioManager._bgmBuffer !== buffer || !((_a = buffer._sourceNodes) == null ? void 0 : _a.length)) return;
        const baseRate = buffer._pitch || 1;
        if (this.schedulePlaybackRate(
          buffer,
          0,
          baseRate,
          pending.duration,
          pending.easingType
        )) {
          this._pendingStart = null;
        }
      }
    };
    const _WebAudio_play = WebAudio.prototype.play;
    WebAudio.prototype.play = function(loop, offset) {
      const result = _WebAudio_play.call(this, loop, offset);
      Tape.applyPendingStart(this);
      return result;
    };
    PluginManager.registerCommand(PLUGIN_NAME, "tapeStop", (args) => {
      Tape.tapeStop(
        resolveDuration(args.duration, defaultStopDuration),
        resolveEasing(args.easing, defaultStopEasing)
      );
    });
    PluginManager.registerCommand(PLUGIN_NAME, "tapeStart", (args) => {
      Tape.tapeStart(
        resolveDuration(args.duration, defaultStartDuration),
        resolveEasing(args.easing, defaultStartEasing),
        createBgm(args)
      );
    });
  })();
})();
