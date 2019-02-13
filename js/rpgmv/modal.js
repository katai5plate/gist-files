var addModal = (id) => {
  const css = {
    modal: {
      zIndex: 10000,
      position: "absolute",
      backgroundColor: "white",
      width: "320px",
      height: "240px",
    }
  };
  let dom = Object
    .keys(css.modal)
    .reduce(
      (p,c) => {
        p.style[c] = css.modal[c];
        return p;
      },
      document.createElement("div")
    );
  dom.classList.add("__modal");
  dom.id = id;
  document.body.appendChild(dom);
}
var removeModal = (id) => {
  [...document.body.children]
    .filter(
      v =>
        v.id === id &&
        [...v.classList].includes("__modal")
    )
    .forEach(v => v.remove());
}
