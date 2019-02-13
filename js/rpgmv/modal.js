var createDOM = ({name = "div", props = {}, style = {}, children = []} = {}) => {
  let dom = Object.keys(props)
    .reduce((p,c) => {p[c] = props[c]; return p}, document.createElement(name));
  dom = Object.keys(style)
    .reduce((p,c) => {p.style[c] = style[c]; return p;}, dom);
  children.forEach(child => dom.appendChild(child));
  return dom;
}

var addModal = (id, innerHTML = "") => {
  if(findModal(id).length !== 0) console.error("Already exists!");
  document.body.appendChild(
    createDOM({
      name: "div",
      props: {
        id,
        className: "__modal",
        innerHTML,
      },
      style: {
        zIndex: 10000,
        position: "absolute",
        backgroundColor: "white",
        width: "320px",
        height: "240px",
      },
      children: [
        createDOM({
          name: "button",
          props: {innerText: "CLOSE", onclick: () => removeModal(id)},
          style: {position: "absolute", bottom: 0, fontSize: "24px"}
        }),
      ],
    })
  )
};

var findModal = (id) => {
  return [...document.body.children]
    .filter(
      v =>
        v.id === id &&
        [...v.classList].includes("__modal")
    );
}

var removeModal = (id) => {
  findModal(id).forEach(v => v.remove());
}
