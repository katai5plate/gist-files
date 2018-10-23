// RPGアツマールのランキングに乗ってるゲームのIDを全部取得
(()=>{
    const b = document.body;
    const t = b.getElementsByClassName("thumbnail");
    const d = b.getElementsByClassName("description");
    const r = (()=>{
        let a=[], i=0;
        while(i<t.length){
            a.push({t:t[i],d:d[i]});
            i++;
        }
        return a;
    })();
    let doc="";
    r.forEach(v=>{
        const url = v.d.childNodes[0].childNodes[0].attributes[0].nodeValue;
        doc += url.replace("/atsumaru/games/","")+"\n";
    });
    b.innerText = doc;
})()
