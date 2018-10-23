function splitReplace(t,s,r){
    return r.reduce(
        (p,c)=>p.replace(c[0],c[1]),
        s.reduce(
            (p,c)=>p.split(c[0])[c[1]],t
        )
    );
}
function main(){
    //textarea
    const source = document.getElementById("source");
    const text = source.value;
    //h3
    const title = document.getElementById("title");
    //img
    const thumb = document.getElementById("thumb");
    try{
        source.value = convSource(text);
        title.innerText = "Title: "+convTitle(text);
        thumb.src = convThumbnail(text);
    }catch(e){
        console.warn(e);
    }
}
function convSource(origin){
    return splitReplace(origin,[
        ["<!-- /sns button top -->",1],
        ["<!-- sns button bottom -->",0],
        ["</div>",2],
    ],[
        [/width=\"\d*\" height=\"\d*" /g,""],
        [/sizes="\([a-z\-\:\s\d,\)]*"/g,""],
        [/\s\s/g,""],
    ])
}
function convTitle(origin){
    return splitReplace(origin,[
        ["<title>",1],
        ["</title>",0],
    ],[
        [/&quot;/g,"\""],
        [/【.+?】/g,""],
        [/[|].+/g,""],
    ])
}
function convThumbnail(origin){
    return splitReplace(origin,[
        ["<meta property=\"og:image\" content='",1],
        ["'>",0],
    ],[])
}

/*
<!doctype html>
<html>
    <head>
        <meta charset="utf-8">
        <style>
            .btn{
                width: 50%;
                height: 50px;
            }
        </style>
    </head>
    <body>
        <br><input type="button" class="btn" value="Run" onclick="main()"/>
        <br><textarea id="source" cols="50" rows="25"></textarea>
        <h3>Title</h3>
        <div id="title"></div>
        <h3>Thum</h3>
        <img id="thumb" witdh="100px" height="100px">
        <script src="./srcConverter.js"></script>
    </body>
</html>
*/
