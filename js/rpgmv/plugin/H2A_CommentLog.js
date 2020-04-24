/*:
 * @plugindesc 投稿されたコメントをグローバルシグナルに送信
 * @author Had2Apps
 * @help
 * コメントが投稿されると同時に、グローバルシグナルに内容が送信されます。
 * これにより、誰がどのコメントを行ったかを特定することができます。
 */
(function () {
  if (window.RPGAtsumaru === undefined) {
    console.warn("APIが読み込めません");
    return;
  }
  var sendCommentLog = (res) => {
    var comment = res.comment;
    var log = comment.slice(0, 100);
    window.RPGAtsumaru.experimental.signal.sendSignalToGlobal(log).then(() => {
      console.log("OK");
    });
  };
  window.RPGAtsumaru.comment.posted.subscribe(sendCommentLog);
})();
