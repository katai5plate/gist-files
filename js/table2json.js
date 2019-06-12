const table2Json = (query = "tr") => [...document.body.querySelectorAll(query)]
  .map(({children})=>[...[...children].map(({innerText})=>innerText)])
  .map((row,_,self)=>self[0].reduce((p,c,i)=>({...p, [c]:row.slice("-4")[i]}),{}))
  .slice(1)
