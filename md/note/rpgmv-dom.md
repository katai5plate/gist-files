# テキストボックスを出す
```js
input = document.createElement("input");
input.setAttribute("style",'z-index:999; position:absolute;');
document.body.appendChild(input);
// get
console.log(input.value);
// end
input.remove();
```
# 文字を出す
```js
text = document.createElement("h1");
text.setAttribute("style",'z-index:999; position:absolute;');
text.appendChild(document.createTextNode("Hello!"));
document.body.appendChild(text);
// end
text.remove();
```
# DOM出力の煩わしさを軽減する
```js
div = document.createElement("div");
div.setAttribute("style",'z-index:999; position:absolute;');
target = "World";
div.innerHTML = `<h1>Hello, ${target}!</h1>`;
document.body.appendChild(div);
```
