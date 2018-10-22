var input = {};
var inputHandle = function (x) { input = !!x ? { key: x.key } : {}; };
var getKey = function (c) { if (!!input.key) { return input.key == c; } return !1; }
document.addEventListener("keydown", inputHandle);
document.addEventListener("onkeydown", inputHandle);
var wakeUp = function (i, m, t) { i(), setInterval(() => { m(); input = {}; }, t); };

// ---------------------------------------

var sel = 0;
var list = ["YES", "NOT BAD", "NO", "HATE"];
var scene = 0;

var init = function () {
    console.clear();
};

var update = function () {
    console.clear();
    if (scene == 0) {
        console.log("# DO YOU LOVE ME ? # : " + sel + " ----------");
        for (let x = 0; x < list.length; x++)console.log((sel == x ? "> " : ". ") + list[x])
        if (getKey("s")) { sel++; }
        if (getKey("w")) { sel = sel == 0 ? list.length - 1 : sel - 1; }
        if (getKey("Enter")) { scene = 1; }
    } else {
        console.log("# Your Select is " + list[sel] + " !!");
    }
    sel %= list.length;
};

// ---------------------------------------
wakeUp(init, update, 200);
