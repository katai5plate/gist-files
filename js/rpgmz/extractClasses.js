// 必須: Node.js
// 1. この js と同ディレクトリにコアスクリプトの入った js/ を置く。
// 2. コマンド: npm init -y && npm i fs-extra && node extractClasses.js

const fs = require("fs-extra");
const delimit =
  "//-----------------------------------------------------------------------------";
const list = [
  "core",
  "managers",
  "objects",
  "scenes",
  "sprites",
  "windows",
].reduce(
  (p, rmmzName) => [
    ...p,
    ...fs
      .readFileSync(`./js/rmmz_${rmmzName}.js`, { encoding: "utf8" })
      .split(delimit)
      .map((code) => ({
        code,
        rmmzName,
        className:
          code.match(/^function ([\s\S]*?)\(\) {\n/m)?.[1] ||
          code.match("@namespace (JsExtensions)")?.[1],
      }))
      .map((data) => ({
        ...data,
        filename: `${data.rmmzName}/${data.className}`,
      }))
      .filter(({ className }) => className),
  ],
  []
);

list.forEach(({ code, filename }) => {
  console.log(filename);
  fs.outputFileSync(`${__dirname}/${filename}.js`, code);
});

fs.outputJSONSync(
  `${__dirname}/meta.json`,
  { delimit, filenames: list.map((x) => x.filename) },
  { spaces: 2 }
);
