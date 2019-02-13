var createDOM = ({name = "div", option = {}, style = {}} = {}) => {
  const dom = Object.keys(option)
    .reduce((p,c) => {p[c] = option[c]; return p}, document.createElement(name));
  return Object.keys(style)
    .reduce((p,c) => {p.style[c] = style[c]; return p;}, dom);
}

var addModal = (id) => document.body.appendChild(
  createDOM(
    {
      name: "div",
      option: {id, className: "__modal"},
      style: {
        zIndex: 10000,
        position: "absolute",
        backgroundColor: "white",
        width: "320px",
        height: "240px",
      }
    }
  )
);

var removeModal = (id) => {
  [...document.body.children]
    .filter(
      v =>
        v.id === id &&
        [...v.classList].includes("__modal")
    )
    .forEach(v => v.remove());
}
