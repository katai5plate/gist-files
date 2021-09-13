// ツクールMZをJSDOMで実行しようとした努力の軌跡

const { JSDOM } = require("jsdom");
const mockXMLHR = require("mock-xmlhttprequest");
const fs = require("fs");

const dom = new JSDOM();

class Mock {
  constructor() {
    this.log = [];
    fs.writeFileSync("./log", "");
  }
  static TYPE_PROXY_OBJECT = "TYPE_PROXY_OBJECT"
  static proxyObj(name, data = {}, pusher = () => {}) {
    return new Proxy(data, {
      get(_, ref) {
        pusher({ type: Mock.TYPE_PROXY_OBJECT, name, data, ref });
        return Reflect.get(...arguments);
      },
    });
  }
  static TYPE_OBJECT = "TYPE_OBJECT";
  push(data) {
    fs.appendFileSync("./log", JSON.stringify(data, null, 2) + "\n");
    this.log.push(data);
  }
  obj(name, data = {}) {
    this.push({ type: Mock.TYPE_OBJECT, name, data });
    return Mock.proxyObj(name, data, this.push);
  }
  static TYPE_FUNCTION_OBJECT = "TYPE_FUNCTION_OBJECT";
  fnObj(name, data = {}) {
    const that = this;
    return function () {
      that.push({
        type: Mock.TYPE_FUNCTION_OBJECT,
        name,
        data,
        args: [...arguments],
      });
      return Mock.proxyObj(name, data, that.push.bind(that));
    };
  }
  static TYPE_FUNCTION_CLASS = "TYPE_FUNCTION_CLASS";
  fnCls(name, data = {}) {
    const that = this;
    const d = {
      ...data,
      constructor: this.obj("constructor",{
        toJSON: this.fnObj("toJSON")
      }),
      prototype: this.obj("prototype"),
    };
    const f = function () {
      that.push({
        type: Mock.TYPE_FUNCTION_CLASS,
        name,
        data: d,
        args: [...arguments],
      });
      return Mock.proxyObj(name, d, that.push.bind(that));
    };
    Object.entries(data).forEach(([k, v]) => {
      f[k] = v;
    });
    return f;
  }
}
const m = new Mock();

globalThis.window = dom.window;
globalThis.XMLHttpRequest = mockXMLHR.newMockXhr();

globalThis.document = {
  ...dom.window.document,
  body: {
    ...dom.window.document.body,
    ...{
      appendChild: m.fnObj("appendChild"),
      removeChild: m.fnObj("removeChild"),
    },
  },
  createElement: m.fnObj("createElement", {
    appendChild: m.fnObj("appendChild"),
    getContext: m.fnObj("getContext", {
      drawImage: m.fnObj("drawImage"),
      fillRect: m.fnObj("fillRect"),
    }),
  }),
  getElementById: m.fnObj("getElementById", {}),
  currentScript: m.fnObj("currentScript", {
    src: m.fnObj("src"),
  }),
};

globalThis.Worker = m.fnCls("Worker", {
  addEventListener: m.fnObj("addEventListener"),
});
globalThis.PIXI = {
  Point: m.fnCls("Point"),
  Rectangle: m.fnCls("Rectangle"),
  Sprite: m.fnCls("Sprite"),
  Container: m.fnCls("Container"),
  ObjectRenderer: m.fnCls("ObjectRenderer"),
  Renderer: m.fnCls("Renderer", {
    registerPlugin: m.fnObj("registerPlugin"),
  }),
  Tilemap: m.fnObj("Tilemap"),
  TilingSprite: m.fnCls("TilingSprite"),
  Filter: m.fnCls("Filter"),
};
globalThis.Sprite = m.fnCls("Sprite");
globalThis.TilingSprite = m.fnCls("TilingSprite");
globalThis.Bitmap = m.fnCls("Bitmap");
globalThis.Stage = m.fnCls("Stage");
globalThis.Window = m.fnCls("Window");
globalThis.HTMLVideoElement = m.fnCls("HTMLVideoElement");
globalThis.HTMLCanvasElement = m.fnCls("HTMLCanvasElement");
globalThis.HTMLImageElement = m.fnCls("HTMLImageElement");
globalThis.Image = m.fnCls("Image");

// globalThis.Url = m.fnCls("Url", {
//   indexOf: m.fnObj("indexOf"),
// });
