var dom = (n,o) => {
  let e = document.createElement(n);
  Object.keys(o).map((v)=>{
    e[v] = o[v]
  },e);
  return e;
}

// dom("div", {id:1, innerText:2}) // <div id="1">2</d>
