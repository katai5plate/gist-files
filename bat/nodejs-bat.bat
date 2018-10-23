rem= ""; /* 

: Node.jsの有無を確認
where /q node || exit

: 自身を実行
node %~0 %*

: ポーズ(任意)
pause

: 終了
exit
*/

// コマンド dir を実行して出力
console.log(
  require("child_process")
    .execSync("dir")
    .toString()
    .split(/\r\n/)
);
