var analyzeClass = (C) => {
  const entries = Object.entries(C.prototype || C);
  // 関数リスト
  const functions = (
    entries.length
      ? // ES5 class
        entries
      : // ES6+ class
        Object.getOwnPropertyNames(C.prototype).map(
          (p) => [p, C.prototype[p]],
          []
        )
  ).map(([name, v]) => ({
    name,
    code: v?.toString() || "",
  }));
  // メンバ変数リスト
  const members = Object.entries(
    functions
      .reduce(
        (p, { name: fnName, code }) => [
          ...p,
          ...(code.match(/this\.[_0-9a-zA-Z]+/g) || [])
            .map((name) => ({ name, fnName }))
            .filter(
              ({ name }) => !functions.find((f) => `this.${f.name}` === name)
            ),
        ],
        []
      )
      .map((x) => ({ ...x, name: x.name.replace("this.", "") }))
      .reduce(
        (p, c) => ({
          ...p,
          [c.name]: p[c.name] ? [...p[c.name], c.fnName] : [c.fnName],
        }),
        {}
      )
  ).map(([name, v]) => ({ name, fnNames: [...new Set(v)] }));
  // 継承リスト
  let { prototype } = C;
  let prototypes = [];
  while (prototype) {
    prototypes = [...prototypes, prototype?.constructor?.name || ""];
    prototype = Object.getPrototypeOf(prototype);
  }
  return { functions, members, prototypes };
};
