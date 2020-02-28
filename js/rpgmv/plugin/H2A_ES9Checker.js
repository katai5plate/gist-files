/*:
 * @plugindesc ES9(ES2018)に未対応ならエラーにする
 * @author Had2Apps
 *
 * @help
 *
 * JavaScript ES9(ES2018) に対応しているかどうかを確認し、
 * 動作条件を満たしていない場合はエラーを発生させます。
 *
 * 確認事項：
 * - Promise.prototype.finally
 * - for await of
 * - オブジェクトでスプレッド演算子を使用する
 * - 正規表現: s
 * - 正規表現: Named capture groups
 * - 正規表現: 後方参照
 * - 正規表現: 先読み, 後読み
 * - 正規表現: Unicodeプロパティエスケープ
 *
 * 推奨するブラウザ
 * - Chrome 80 以上
 * - Edge 80 以上
 * - Opera 66 以上
 * - Safaro 13 以上
 * - iOS Safari 13.2 以上
 * - Android Browser 80 以上
 * - Samsung Internet 10.1 以上
 *
 * 補足
 * - Safari 13 は 「正規表現: 先読み, 後読み」に未対応です。
 * - Firefox 73 は対応していない ES9 構文が多いです。
 *
 */

(function() {
  function check() {
    try {
      eval(
        "(async()=>{await new Promise(r=>Promise.resolve(0).finally(()=>r()))})()"
      );
      eval(
        "(async()=>{const arr=new Array(5).map(v=>Promise.resolve(v));for await(let a of arr){}})()"
      );
      eval(
        "(()=>{var {a,...r}={a:1,b:2,c:3};var x={...r,b:1,c:[...[0,1,2]]}})()"
      );
      eval("(()=>{if(!/x.y/s.test('x\\ny'))throw new Error()})()");
      eval(
        '(()=>{if(JSON.stringify(/(?<a>\\d{1})-(?<b>\\d{2})/u.exec(\'1-22\').groups)!==\'{"a":"1","b":"22"}\')throw new Error()})()'
      );
      eval(
        "(()=>{if('1-22'.replace(/(?<a>\\d{1})-(?<b>\\d{2})/u,'$<a>/$<b>')!=='1/22')throw new Error()})()"
      );
      eval("(()=>{if(/^(?<x>.*).k<x>$/u.test('a*a'))throw new Error()})()");
      eval(
        "(()=>{['123456'.match(/123(?=456)/),'123'.match(/123(?!456)/),'123456'.match(/(?<=123)456/),'456'.match(/(?<!123)456/)].includes(null)})()"
      );
      eval("(()=>{if(!/^\\p{sc=Hiragana}/u.test('あ'))throw new Error()})()");
    } catch (error) {
      SceneManager.stop();
      Graphics.printError(
        "お使いのブラウザはサポートされておりません。<br />以下のブラウザでお試しください。",
        [
          "Chrome 80 以上 / Edge 80 以上",
          "Opera 66 以上 / iOS Safari 13.2 以上",
          "Android Browser 80 以上",
          "Samsung Internet 10.1 以上"
        ].join("<br />")
      );
      AudioManager.stopAll();
    }
  }
  var i = setInterval(() => {
    if (window.Graphics && window.SceneManager && window.AudioManager)
      clearInterval(i);
    check();
  }, 1);
})();
