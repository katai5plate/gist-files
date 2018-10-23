(() => {
    const TARGET_URL = "";
    const PARENT_SELECTOR = "";
    const CHECKBOXES_SELECTOR = "";
    const FROMTO_SELECTOR = "";
    const REG_FROM_SELECTOR = "";
    const REG_TO_SELECTOR = "";

    if (location.href.indexOf(TARGET_URL) == -1) {
        alert("This place is not my work place.");
    }
    else {
        var parent = PARENT_SELECTOR;
        var addbtn = (n, f) => {
            var btn = document.createElement("input");
            btn.type = "button";
            btn.value = n;
            btn.onclick = f;
            $(parent)[0].appendChild(btn);
        };
        addbtn("Function-A", () => {
            var services = $(CHECKBOXES_SELECTOR);
            for (var i = 0;
                i < services.length;
                i++) {
                var f = services[i].childNodes[0];
                f.checked = false;
            }
            var toInput = $(FROMTO_SELECTOR);
            var to = new Date(toInput[0].childNodes[1].value);
            to.setDate(to.getDate() + 1);
            toInput[1].childNodes[1].value = to.getFullYear() + "-" + (to.getMonth() + 1) + "-" + to.getDate();
        });
        addbtn("Function-B", () => {
            var d = new Date();
            var f = [$(REG_FROM_SELECTOR)[0], $(REG_TO_SELECTOR)[0]];
            var s = (v) => ("000" + v).slice(-2);
            var n = d.getFullYear() + "-" + s(d.getMonth() + 1) + "-" + s(d.getDate()) + " 00-00-00";
            var m = (v) => v.match(/\d{4}-\d{2}-\d{2}\s\d{2}-\d{2}-\d{2}/) != null;
            f[0].value = m(f[0].value) ? f[0].value : n;
            f[0].value = window.prompt("FROM", f[0].value);
            f[1].value = m(f[1].value) ? f[1].value : n;
            f[1].value = window.prompt("TO", f[1].value);
        });
    }
})()
