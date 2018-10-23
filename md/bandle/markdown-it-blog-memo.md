# markdown-itでブログを作るメモ
## package.json
```json
{
  "name": "mdnext",
  "version": "1.0.0",
  "main": "index.js",
  "license": "MIT",
  "dependencies": {
    "fs-extra": "^7.0.0",
    "markdown-it": "^8.4.2",
    "markdown-loader": "^3.0.0",
    "next": "^6.1.1",
    "react": "^16.4.2",
    "react-dom": "^16.4.2"
  },
  "scripts": {
    "start": "next",
    "start:c": "next --port 3001",
    "build:md": "node convert",
    "setup": "yarn install && yarn build:md"
  }
}
```
## pages/index.js
```jsx
import React from 'react';
import articles from "../markdown/markdown.json";

export default () => (
    <div
        dangerouslySetInnerHTML={{ __html: articles[0].content }}
    />
)
```
## convert/index.js
```js
const md = require("markdown-it")();
const fs = require("fs-extra");

const __markdownDir = "markdown";

const __markdownCategories = [
    "article/new",
    "article/old",
    "fixed",
];

(async () => {
    let output = [];
    for(let category of __markdownCategories){
        const dpath = `${__markdownDir}/${category}`
        const flist = await fs.readdir(dpath);
        for(let file of flist){
            const fpath = `${dpath}/${file}`;
            const fstat = await fs.statSync(fpath);
            if (fstat.isFile()) {
                const content = await fs.readFile(fpath, { encoding: 'utf8' });
                output = [...output, {
                    name:`${category}/${file}`,
                    content:  md.render(content)
                }]
            }
        }
    }
    fs.writeFile(`${__markdownDir}/markdown.json`,JSON.stringify(output,null,"  "));
})()
```
## ディレクトリ構造
```
├─convert
├─markdown
│  ├─article
│  │  ├─new <-- ここにmdを置く
│  │  └─old <-- ここにmdを置く
│  └─fixed <-- ここにmdを置く
└─pages
```
## markdown/markdown.json (Convert後、自動生成)
```json
[
  {
    "name": "article/new/hi.md",
    "content": "<h1>Hip, Hip</h1>\n<pre><code>[ARRAY]\n</code></pre>\n"
  },
  {
    "name": "article/old/jack.md",
    "content": "<h1>Description</h1>\n<pre><code>Once upon a time there was a boy called Jack. He lived with his mother. They were very poor. All they had was a cow.\n</code></pre>\n"
  },
  {
    "name": "fixed/profile.md",
    "content": "<h1>Hi</h1>\n<ul>\n<li>name : Hiroshi</li>\n<li>sex : Man</li>\n<li>age : 18</li>\n</ul>\n"
  },
  {
    "name": "fixed/test.md",
    "content": "<h1>Hello!</h1>\n<h2>World!</h2>\n<ul>\n<li>helohelohelohelo...</li>\n</ul>\n"
  }
]
```
