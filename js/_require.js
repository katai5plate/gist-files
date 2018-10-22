const _require = (async (url, defVal) => {const $r = await fetch(url), $t = await $r.text(); return eval((`${defVal}=` || "") + $t)});
// _require("https://cdn.jsdelivr.net/npm/lodash@4.17.11/lodash.min.js")
