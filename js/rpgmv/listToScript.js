// イベントコマンドをスクリプト化する

const linkToScript = (list, replacer = code => `${code}`.padStart(3, "0")) =>
  list
    .map(
      ({ indent, code, parameters }) =>
        `${"\t".repeat(indent)}${replacer(code)} ${JSON.stringify(parameters)
          .replace(/^\[(.*?)\]$/, "$1")
          .replace(/,/g, ", ")}`
    )
    .join("\n");
const scriptToList = (scr, replacer = Number) =>
  scr
    .split("\n")
    .map(x => x.match(/^(\t{0,})(.*?) (.*?)\s*$/).slice(1))
    .map(([i, c, x]) => ({
      indent: i.length,
      code: replacer(c),
      parameters: JSON.parse(`[${x}]`)
    }));
