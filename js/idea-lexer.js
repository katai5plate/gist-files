const lexer = (a) => {
    const analyze = {
        brack: 0,
        category: "",
        elements: [],
    };
    for (const i of a) {
        let category;
        if (!(i.match(/[^a-z]/gi))) {
            category = "alpha";
        } else if (!isNaN(i)) {
            category = "number";
        }
        switch (i) {
            case "「":
                category = "brack";
                analyze.brack++;
                break;
            case "」":
                category = "brack";
                analyze.brack--;
                break;
            default:
                break;
        }
        analyze.elements.push({
            brack: analyze.brack,
            category: category,
            value: i,
        });
    }
    return analyze.elements;
};

console.log(lexer("「「1」22「333」」"));
