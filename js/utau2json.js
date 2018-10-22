var fs = require('fs');
var ic = require('iconv-lite');

fs.readFile('test.ust', (e, d) => {
    if (e) throw e;
    var r = ic.decode(
        new Buffer(d, "binary"),
        "Shift_JIS"
    );
    var a = r.split("\r\n");
    var j = {};
    var clname = "";
    for(var i=0;i<a.length;i++){
        var v = a[i];
        if(!!v.match(/\[#([A-Z0-9]+)\]/)){
            //a[i]=["label",v.replace(/\[#([A-Z0-9]+)\]/g,"$1")];
            clname = v.replace(/\[#([A-Z0-9]+)\]/g,"$1");
            j[clname] = {};
        }else if(v.indexOf("=")>-1){
            //a[i]=("param="+v).split("=");
            if(j[clname]["param"]==null){
                j[clname]["param"]={};
            }
            var p = v.split("=");
            var c = p[1] == "" ? null :
                    !isNaN(p[1]) ? Number(p[1]) : p[1];
            j[clname]["param"][p[0]] = c;
        }else{
            //a[i]=["meta",v];
            if(v!=""){
                if(j[clname]["meta"]==null){
                    j[clname]["meta"]=[];
                }
                j[clname]["meta"].push(v);
            }
        }
    }
    //console.log(j);
    console.log(JSON.stringify(j));
    fs.writeFileSync("test.json",JSON.stringify(j));
});
