(()=>{
  const {width,height} = $dataMap;
  const regionList = $dataMap.data
    .filter((v,i)=>i>=(5*height)*width&&i<(6*height)*width)
    .map((value,i)=>({value,x:i%width,y:(i/width)>>0}))
})()
