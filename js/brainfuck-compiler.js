const bf2js=(bf)=>`async()=>{var p=[],c=0,i="",w=()=>new Promise(r=>setTimeout(r,1));document.onkeydown=e=>i=e.key.charCodeAt();${bf.replace(/(.)/g,m=>["++c;","--c;","p[c]=p[c]===undefined?1:p[c]+1;","p[c]=p[c]===undefined?-1:p[c]-1;","while(p[c]){","await w();}","p[c]=i;","console.log(String.fromCharCode(p[c]));"]["><+-[],.".indexOf(m)])}}`;

// const run=bf=>eval(bf2js(bf))();
// run('>+++++++++[<++++++++>-]<.>+++++++[<++++>-]<+.+++++++..+++.[-]>++++++++[<++++>-]<.>+++++++++++[<+++++>-]<.>++++++++[<+++>-]<.+++.------.--------.[-]>++++++++[<++++>-]<+.[-]++++++++++.');
