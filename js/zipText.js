// 半角英数文字列の２文字を１文字に圧縮した文字列に変換する
var zipText=text=>((a,s)=>Array.from({length:Math.ceil(a.length/s)},(_,i)=>a.slice(i*s,i*s+s)).map(v=>v.join("")))([...text].map(v=>v.charCodeAt().toString(16)),2).map(v=>String.fromCodePoint("0x"+v)).join("");
var unzipText=text=>unescape(escape(text).replace(/u(..)/g,"$1%"));
