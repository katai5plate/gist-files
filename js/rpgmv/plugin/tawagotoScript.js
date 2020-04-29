/*:
 * @plugindesc たわごとスクリプト
 * @author Had2Apps
 *
 * @help
 * new TawagotoScript() を使用することで、
 * イベントコマンドのJSONデータを生成します。
 *
 * const t = new TawagotoScript();
 * t.mes("あいうえお！");
 * console.log(t.getList());
 */
(() => {
  const WINDOW_MODE = {
    WINDOW: 0,
    BLACK: 1,
    NONE: 2,
  };
  const CHOICE_CASES = {
    CASE_1: 0,
    CASE_2: 1,
    CASE_3: 2,
    CASE_4: 3,
    CASE_5: 4,
    CASE_6: 5,
  };
  const WINDOW = {
    FACE: {
      EMPTY: ["", 0],
    },
    MODE: WINDOW_MODE,
    POS: { TOP: 0, CENTER: 1, BOTTOM: 2 },
  };
  const CHOICE = {
    WIN: WINDOW_MODE,
    POS: { LEFT: 0, CENTER: 1, RIGHT: 2 },
    INIT: { NONE: -1, ...CHOICE_CASES },
    ESC: { OK: -2, NG: -1, ...CHOICE_CASES },
  };
  const AUDIO = {
    VOL: { MIN: 0, MUTE: 0, HALF: 50, MAX: 100 },
    PITCH: { SLOW: 50, DEFAULT: 100, FAST: 150 },
    PAN: { LEFT: -100, CENTER: 0, RIGHT: 100 },
  };
  const PICTURE = {
    POINT: { CORNER: 0, CENTER: 1 },
    POS: { ZERO: [0, 0] },
    POSMODE: { VALUE: 0, VARIABLE: 1 },
    SCALE: { ZERO: [0, 0], DEFAULT: [100, 100] },
    ALFA: { HIDE: 0, HALF: 127, VISIBLE: 255 },
    MIXMODE: { DEFAULT: 0, ADD: 1, SUB: 2, SCREEN: 3 },
  };
  const COLOR = {
    BLACK: [0, 0, 0],
    RED: [255, 0, 0],
    GREEN: [0, 255, 0],
    BLUE: [0, 0, 255],
    YELLOW: [255, 255, 0],
    CYAN: [0, 255, 255],
    MAGENTA: [255, 0, 255],
    WHITE: [255, 255, 255],
  };
  const INTERPRETER = {
    EMPTY: 0,
    SCRIPT_BEGIN: 355,
    SCRIPT: 655,
    PLAY_BGM: 241,
    PLAY_BGS: 245,
    PLAY_ME: 249,
    PLAY_SE: 250,
    MESSAGE_INIT: 101,
    MESSAGE: 401,
    CHOICE_INIT: 102,
    CHOICE_CASE: 402,
    CHOICE_ESC: 403,
    CHOICE_END: 404,
    LABEL: 118,
    LABEL_JUMP: 119,
    WAIT: 230,
    GOTO_MENU: 351,
    GOTO_SAVE: 352,
    GOTO_GAMEOVER: 353,
    GOTO_TITLE: 354,
    SCREEN_COLOR: 223,
  };

  const createInterpreterItem = (code, parameters, indent = 0) => ({
    code,
    parameters,
    indent,
  });

  const valid = {
    isStringArray(value) {
      if (value instanceof Array)
        return !value.map((x) => typeof x === "string").includes(false);
      return false;
    },
    lengthIs(value, count) {
      if (value instanceof Array) return value.length === count;
      return false;
    },
  };

  class TawagotoScript {
    constructor({ window, choice, audio, picture } = {}) {
      this.state = {
        window: {
          face: WINDOW.FACE.EMPTY,
          mode: WINDOW.MODE.WINDOW,
          pos: WINDOW.POS.BOTTOM,
          ...window,
        },
        choice: {
          win: CHOICE.WIN.WINDOW,
          pos: CHOICE.POS.RIGHT,
          init: CHOICE.INIT.NONE,
          esc: CHOICE.ESC.NG,
          ...choice,
        },
        audio: {
          vol: AUDIO.VOL.MAX,
          pitch: AUDIO.PITCH.DEFAULT,
          pan: AUDIO.PAN.CENTER,
          ...audio,
        },
        picture: {
          point: PICTURE.POINT.CORNER,
          pos: PICTURE.POS.ZERO,
          posMode: PICTURE.POSMODE.VALUE,
          scale: PICTURE.SCALE.DEFAULT,
          alfa: PICTURE.ALFA.VISIBLE,
          mixMode: PICTURE.MIXMODE.DEFAULT,
          ...picture,
        },
      };
      this.list = [];
    }
    /**
     * 配列の場合: そのまま返す
     * 複数行文字列の場合: 1行目が空なら省略、各行のスペースorタブを除外
     * １行文字列の場合: 単純に配列変換
     * @param {string|string[]} message
     * @returns {string[]}
     */
    messageToArray(message) {
      if (valid.isStringArray(message)) return message;
      if (typeof message !== "string")
        throw new TypeError("メッセージの型が不正です。");
      const texts = message.split("\n");
      if (texts.length === 1) return [texts[0]];
      const fixed = texts.map((x) => x.trim());
      const [one, ...rest] = fixed;
      if (one === "") return rest;
      return fixed;
    }
    getList() {
      return [...this.list, createInterpreterItem(INTERPRETER.EMPTY, [])];
    }
    setWindow(option) {
      this.state.window = { ...this.state.window, ...option };
    }
    setChoice(option) {
      this.state.choice = { ...this.state.choice, ...option };
    }
    setAudio(option) {
      this.state.audio = { ...this.state.audio, ...option };
    }
    setPicture(option) {
      this.state.picture = { ...this.state.picture, ...option };
    }
    js(message) {
      const [one, ...rest] = this.messageToArray(message);
      const result = [
        createInterpreterItem(INTERPRETER.SCRIPT_BEGIN, [one]),
        ...rest.map((x) => createInterpreterItem(INTERPRETER.SCRIPT, [x])),
      ];
      this.list = [...this.list, ...result];
      return result;
    }
    playAudio(code, name) {
      const { vol: volume, pitch, pan } = this.state.audio;
      const result = [
        createInterpreterItem(code, [{ name, volume, pitch, pan }]),
      ];
      this.list = [...this.list, ...result];
      return result;
    }
    bgm(name) {
      return this.playAudio(INTERPRETER.PLAY_BGM, name);
    }
    bgs(name) {
      return this.playAudio(INTERPRETER.PLAY_BGS, name);
    }
    me(name) {
      return this.playAudio(INTERPRETER.PLAY_ME, name);
    }
    se(name) {
      return this.playAudio(INTERPRETER.PLAY_SE, name);
    }
    mes(message) {
      const { face, mode, pos } = this.state.window;
      if (!valid.lengthIs(face, 2))
        throw new TypeError("顔グラフィック設定が不正です。");
      const text = this.messageToArray(message);
      const result = [
        createInterpreterItem(INTERPRETER.MESSAGE_INIT, [...face, mode, pos]),
        ...text.map((x) => createInterpreterItem(INTERPRETER.MESSAGE, [x])),
      ];
      this.list = [...this.list, ...result];
      return result;
    }
    choice(id, cases, escCase = undefined) {
      const { win, pos, init, esc } = this.state.choice;
      const result = [
        createInterpreterItem(INTERPRETER.CHOICE_INIT, [
          cases.map((x) => x.label),
          esc,
          init,
          pos,
          win,
        ]),
        ...cases.reduce(
          (p, { label }, i) => [
            ...p,
            createInterpreterItem(INTERPRETER.CHOICE_CASE, [i, label]),
            createInterpreterItem(INTERPRETER.LABEL_JUMP, [`${id}_${i}`], 1),
            createInterpreterItem(INTERPRETER.EMPTY, [], 1),
          ],
          []
        ),
        ...(escCase !== undefined
          ? [
              createInterpreterItem(INTERPRETER.CHOICE_ESC, [6, null]),
              createInterpreterItem(INTERPRETER.LABEL_JUMP, [`${id}_ESC`], 1),
              createInterpreterItem(INTERPRETER.EMPTY, [], 1),
            ]
          : []),
        createInterpreterItem(INTERPRETER.CHOICE_END, []),
        ...cases.reduce(
          (p, { code }, i) => [
            ...p,
            createInterpreterItem(INTERPRETER.LABEL, [`${id}_${i}`]),
            ...code(new this.constructor()).reduce((p, [c]) => [...p, c], []),
            createInterpreterItem(INTERPRETER.LABEL_JUMP, [`${id}_END`]),
          ],
          []
        ),
        ...(escCase !== undefined
          ? [
              createInterpreterItem(INTERPRETER.LABEL, [`${id}_ESC`]),
              ...escCase(new this.constructor()).reduce(
                (p, c) => [...p, ...c],
                []
              ),
              createInterpreterItem(INTERPRETER.LABEL_JUMP, [`${id}_END`]),
            ]
          : []),
        createInterpreterItem(INTERPRETER.LABEL, [`${id}_END`]),
      ];
      this.list = [...this.list, ...result];
      return result;
    }
    label(name) {
      const result = [createInterpreterItem(INTERPRETER.LABEL, [name])];
      this.list = [...this.list, ...result];
      return result;
    }
    goto(name) {
      const result = [createInterpreterItem(INTERPRETER.LABEL_JUMP, [name])];
      this.list = [...this.list, ...result];
      return result;
    }
    wait(frame) {
      const result = [createInterpreterItem(INTERPRETER.WAIT, [frame])];
      this.list = [...this.list, ...result];
      return result;
    }
    gotoMenu() {
      const result = [createInterpreterItem(INTERPRETER.GOTO_MENU, [])];
      this.list = [...this.list, ...result];
      return result;
    }
    gotoSave() {
      const result = [createInterpreterItem(INTERPRETER.GOTO_SAVE, [])];
      this.list = [...this.list, ...result];
      return result;
    }
    gotoGameOver() {
      const result = [createInterpreterItem(INTERPRETER.GOTO_GAMEOVER, [])];
      this.list = [...this.list, ...result];
      return result;
    }
    gotoTitle() {
      const result = [createInterpreterItem(INTERPRETER.GOTO_TITLE, [])];
      this.list = [...this.list, ...result];
      return result;
    }
    changeScreenColor(color, gray, wait, nonStop = false) {
      if (!valid.lengthIs(color, 3)) throw new TypeError("色指定が不正です。");
      const result = [
        createInterpreterItem(INTERPRETER.SCREEN_COLOR, [
          [...color, gray],
          wait,
          !nonStop,
        ]),
      ];
      this.list = [...this.list, ...result];
      return result;
    }
  }
  TawagotoScript.WINDOW = WINDOW;
  TawagotoScript.CHOICE = CHOICE;
  TawagotoScript.AUDIO = AUDIO;
  TawagotoScript.PICTURE = PICTURE;
  TawagotoScript.COLOR = COLOR;
  TawagotoScript.INTERPRETER = INTERPRETER;

  window.TawagotoScript = TawagotoScript;
})();
