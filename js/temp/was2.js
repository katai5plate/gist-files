function splace(t,s,r){
    return r.reduce(
        (p,c)=>p.replace(c[0],c[1]),
        s.reduce(
            (p,c)=>p.split(c[0])[c[1]],t
        )
    );
}
function exportSrc(origin){
    return splace(origin,[
        // DELETED
    ],[
        // DELETED
    ])
}
function exportHeadline(origin){
    return splace(origin,[
        // DELETED
    ],[
        // DELETED
    ])
}
function exportImage(origin){
    return splace(origin,[
        // DELETED
    ],[])
}
function HERE_WE_GO(){
    const src = document.getElementById("src");
    const srcv = src.value;
    const headline = document.getElementById("headline");
    const image = document.getElementById("image");
    try{
        src.value = exportSrc(srcv);
        headline.innerText = "[HEADER/]"+exportHeadline(srcv)+"[FOOTER/]";
        image.src = exportImage(srcv);
    }catch(e){
        console.error("boo!");
    }
}
