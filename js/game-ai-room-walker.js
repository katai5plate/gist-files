(()=>{
    // マップの繋がり
    const nodes = [
        /*00*/[],     /*01*/[4],          /*02*/[],
        /*03*/[4],    /*04*/[1, 3, 5, 7], /*05*/[4, 8],
        /*06*/[7, 9], /*07*/[6, 10],      /*08*/[5],
        /*09*/[6],    /*10*/[7],          /*11*/[],
    ];
    // 初期位置
    let index = 1;
    // 彷徨い開始
    for (let i = 0; i < 20; i++) {
        const pindex = index;
        index = nodes[pindex][Math.random() * nodes[pindex].length >> 0];
        console.log(index);
    }
})()
