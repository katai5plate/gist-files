class Dom {
  constructor(name = "div", options) {
    this.element = document.createElement(name, options);
  }
  setProps(props) {
    Object.keys(props).map(key => {
      this.element[key] = props[key];
    })
    return this;
  }
  setAttr(attrs) {
    Object.keys(attrs).map(key => {
      this.element.setAttribute(key, attrs[key]);
    })
    return this;
  }
  callFunc(name, ...arg) {
    this.element[name](...arg);
    return this;
  }
  generate(appendTo){
    const output = this.element;
    if (appendTo) {
      appendTo.appendChild(output);
    }
    return output;
  }
}
