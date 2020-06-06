const objToDts = (obj, name) => {
  const normalized = JSON.parse(
    require("json-stringify-safe")(obj, (k, v) =>
      typeof v === "function"
        ? `[FUNCTION:${v
            .toString()
            .replace(/\n/g, "")
            .match(/function.*?\((.*?)\)/)[1]
            .split(",")
            .map((x) => x.trim())
            .filter((x) => x !== "")
            .join(",")}]`
        : typeof v !== "object"
        ? v === null || v === undefined
          ? "[TYPE:any]"
          : `[TYPE:${typeof v}]`
        : v
    )
  );
  const result = `declare const ${name} : ${JSON.stringify(normalized, null, 2)
    .replace(
      /"\[FUNCTION:(.*?)\]"/g,
      (o, w) =>
        `(${
          w.split(",").filter((x) => x !== "").length === 0
            ? ""
            : w
                .split(",")
                .filter((x) => x !== "")
                .map((x) => `${x}: any`)
                .join()
        }) => any`
    )
    .replace(/"\[TYPE:(.*?)\]"/g, "$1")}`;
  require("fs").writeFileSync(`${name}.d.ts`, result, { encoding: "utf8" });
  return result;
};
