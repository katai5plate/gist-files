rem= "起動処理"; /* aviutl.iniと同じフォルダに置いて実行することで推奨設定にしてくれる。要nodejs

node %~0 %*
pause
exit
*/


/* メインJS */

var fs = require('fs');

var file = "aviutl.ini";

fs.readFile(file, 'latin1', function (err,data) {
  if (err) {
    return console.log(err);
  }
  var result = data
  .replace(
    /width=1280/g,
    'width=2200'
  )
  .replace(
    /height=720/g,
    'height=1200'
  )
  .replace(
    /cache=8/g,
    'cache=32'
  )
  .replace(
    /moveA=5/g,
    'moveA=30'
  )
  .replace(
    /moveB=30/g,
    'moveB=150'
  )
  .replace(
    /moveC=899/g,
    'moveC=300'
  )
  .replace(
    /moveD=8991/g,
    'moveD=1800'
  )
  .replace(
    /closedialog=0/g,
    'closedialog=1'
  )
  .replace(
    /windowsnap=0/g,
    'windowsnap=1'
  )
  .replace(
    /resizelist=1280x720,640x480,352x240,320x240/g,
    'resizelist=1920x1080,1440x1080,1280x720,848x480,640x480,352x240,320x240'
  )
  .replace(
    /new_w=640/g,
    'new_w=848'
  );
  fs.writeFile(file, result, 'latin1', function (err) {
     if (err) return console.log(err);
  });
});
