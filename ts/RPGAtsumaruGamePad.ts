type RPGAPadType = "" | "keydown" | "keyup";
type RPGAPadKey = "" | "up" | "down" | "left" | "right" | "ok" | "cancel";

declare global {
  interface Window {
    RPGAtsumaru: {
      $input: {
        type: RPGAPadType,
        key: RPGAPadKey
      },
      $getPad: (RPGAPadKey) => { down: boolean, up: boolean },
      controllers: {
        defaultController: {
          subscribe: (any) => void
        }
      }
    }
  }
}

const onload = () => {
  if (!window.RPGAtsumaru) {
    window.RPGAtsumaru = {
      $input: {
        type: "",
        key: ""
      },
      $getPad: (x) => ({ down: false, up: false }),
      controllers: {
        defaultController: {
          subscribe: () => null
        }
      }
    }
  }
  window.RPGAtsumaru.$input = { type: "", key: "" }
  window.RPGAtsumaru.$getPad = (key: RPGAPadKey) => ({
    down: window.RPGAtsumaru.$input.type === "keydown" &&
      window.RPGAtsumaru.$input.key === key,
    up: window.RPGAtsumaru.$input.type === "keyup" &&
      window.RPGAtsumaru.$input.key === key
  })
  if (window.RPGAtsumaru.controllers) {
    window.RPGAtsumaru.controllers.defaultController.subscribe(
      (key) => {
        window.RPGAtsumaru.$input = key || { type: "", key: "" }
      }
    )
  }
};

export default onload;
