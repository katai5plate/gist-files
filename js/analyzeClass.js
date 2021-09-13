/**
 * クラスを分析する。継承されたメンバ変数までは調べない。
 * @param {ClassDecorator} C 分析するクラス
 * @param {boolean} noCode ソースコードを出力しない
 * @returns {{functions,members,prototypes}} 検出した関数・メンバ変数・継承クラス名
 */
window.analyzeClass = (C, noCode = false) => {
  // 継承リスト
  let { prototype } = C;
  let prototypes = [];
  while (prototype) {
    prototypes = [...prototypes, prototype || ""];
    prototype = Object.getPrototypeOf(prototype);
  }
  // 関数リストを作成。まずは現在のクラスで定義されたものを取得。
  const entries = Object.entries(C.prototype);
  const staticFunctionsOrValues = ((e) =>
    e.length
      ? // ES5 class
        e
      : // ES6+ class
        Object.getOwnPropertyNames(C).map((p) => [p, C[p]], []))(
    Object.entries(C)
  );
  const toFunctionData = ([name, fn]) => ({
    name,
    isReadable: !fn?.toString()?.match(/\[native code\]/), // Proxy の場合こうなる
    code: fn?.toString() || "",
    extendedBy: C.name || C.constructor.name,
    isMember: false,
    isStatic: false,
  });
  let functions = [
    ...(entries.length
      ? // ES5 class
        entries
      : // ES6+ class
        Object.getOwnPropertyNames(C.prototype).map(
          (p) => [p, C.prototype[p]],
          []
        )
    ).map(toFunctionData),
    // static 関数を追加
    ...staticFunctionsOrValues
      .filter(([, v]) => typeof v === "function")
      .map(([name, value]) => {
        const extended = prototypes
          .slice(1)
          .reverse()
          .find((p) => p[name]);
        if (extended)
          return {
            ...toFunctionData([name, value]),
            isStatic: true,
            extendedBy: extended.constructor.name,
            isMember: true,
          };
        return {
          ...toFunctionData([name, value]),
          isStatic: true,
          extendedBy: prototypes[0].constructor.name,
          isMember: true,
          isReadable: true,
        };
      }),
  ];
  /**
   * 代入値から型を推測する関数
   * @param {string[]} fnNames 検索先の関数名
   * @param {string} name 検索するメンバ変数名
   * @returns {{type:string,values:string[]}}
   */
  const getPredictedType = (fnNames, name) => {
    const IS_FUNC = "@@FUNC@@";
    /**
     * 関数のソースコードから代入値か関数かどうか（IS_FUNC）を取得
     * @param {string} code 関数のソースコード
     * @returns {string}
     */
    const codeToValue = (code) =>
      code?.match(new RegExp(`this\.${name} *?\\(`))
        ? IS_FUNC
        : code?.match(
            new RegExp(`this\.${name} *?= *?([_"'\+\-\.\`0-9a-zA-Z]+) *?;`)
          )?.[1];
    // 代入された値リスト
    const values = [
      ...new Set(
        fnNames
          .map((n) =>
            codeToValue(
              functions.filter((x) => x.isReadable).find((f) => f.name === n)
                .code
            )
          )
          .filter(Boolean)
      ),
    ];
    // 判定条件
    const isBoolean = (x) => ["true", "false"].includes(x);
    const isNumber = (x) => !Number.isNaN(Number(x)) || Number.isNaN(x);
    const isString = (x) =>
      x.match(/^".*?"/) || x.match(/^'.*?'/ || x.match(/^`.*?`/));
    const isVoid = (x) => ["null", "undefined"].includes(x);
    // 判定処理
    if (values.length === 0) return { type: "unknown" };
    if (values.find((x) => x === IS_FUNC)) return { type: "function" };
    if (values.every(isBoolean)) return { type: "boolean", values };
    if (values.every(isNumber)) return { type: "number", values };
    if (values.every(isString)) return { type: "string", values };
    if (values.every(isVoid)) return { type: "void", values };
    // 複合的な型だった場合、あり得る型を列挙する
    if (
      values.every((x) =>
        [isBoolean, isNumber, isString, isVoid].find((y) => y(x))
      )
    )
      return {
        type: `${[
          ...new Set(
            values.reduce(
              (p, c) => [
                ...p,
                isBoolean(c)
                  ? "boolean"
                  : isNumber(c)
                  ? "number"
                  : isString(c)
                  ? "string"
                  : isVoid(c)
                  ? "void"
                  : c,
              ],
              []
            )
          ),
        ].join(" | ")} | unknown`,
        values,
      };
    return { type: "unknown", values };
  };
  // メンバ変数リストを作成
  let members = Object.entries(
    functions
      .filter((x) => x.isReadable)
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
  )
    .map(([name, v]) => ({ name, fnNames: [...new Set(v)] }))
    .map(({ name, fnNames }) => ({
      name,
      fnNames,
      predictedType: getPredictedType(fnNames, name),
      isStatic: !!staticFunctionsOrValues
        .filter(([, v]) => typeof v !== "function")
        .find(([k]) => name === k),
    }));
  functions = [
    ...functions,
    // メンバ変数で検出した関数を継承された関数として functions に移動
    ...members
      .filter((x) => x.predictedType.type === "function")
      .map((x) => {
        const extended = prototypes
          .slice(1)
          .reverse()
          .find((p) => p[x.name]);
        if (extended)
          return {
            ...toFunctionData([x.name, extended[x.name]]),
            extendedBy: extended.constructor.name,
            isMember: true,
          };
        return {
          ...toFunctionData([x.name, "[dynamic function]"]),
          extendedBy: prototypes[0].constructor.name,
          isMember: true,
          isReadable: false,
        };
      }),
  ];
  // メンバ変数リストから関数を削除
  members = members.filter((x) => x.predictedType.type !== "function");
  // コードを削除
  if (noCode) functions = functions.map(({ code, ...rest }) => rest);
  // 解析結果を出力
  return {
    functions,
    members,
    prototypes: prototypes.map((x) => x.constructor.name),
  };
};
