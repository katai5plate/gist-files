let api="https://secure.nicovideo.jp/secure/login?site=niconico";
let [mail,password]=["MAIL@ADDRESS.COM","PASSWORD"]
document.body.innerHTML=`
<form action="${api}" method="post" name="run" target="_blank">
<input type="hidden" name="mail" value="${mail}">
<input type="hidden" name="password" value="${password}"></form>`;
document.run.submit();
