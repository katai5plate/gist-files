// import fs from 'fs';
const fs = require('fs');
// import ic from 'iconv-lite';
const ic = require('iconv-lite');
fs.readFile('data.txt', (e, data) => {
  const txt = ic.decode(data, 'Shift_JIS');
  console.log(txt);
});
