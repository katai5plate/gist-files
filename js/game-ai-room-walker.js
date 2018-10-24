(()=>{
    // 記憶数とマップの繋がり
    const historyLimit = 5, nodes = [
        /*00*/[],     /*01*/[4],          /*02*/[],
        /*03*/[4],    /*04*/[1, 3, 5, 7], /*05*/[4, 8],
        /*06*/[7, 9], /*07*/[6, 10],      /*08*/[5],
        /*09*/[6],    /*10*/[7],          /*11*/[],
    ];
    let index = 1, history = [];
    // 彷徨い開始
    for (let i = 0; i < 20; i++) {
        const pindex = index;
        while (history.includes(index)) {
            if (nodes[index].length === 1) {
                index = nodes[pindex][0];
                break;
            }
            index = nodes[pindex][Math.random() * nodes[pindex].length >> 0];
        }
        history = history.concat(index).slice(-historyLimit);
        console.log(index, history);
    }
})()
