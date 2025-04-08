// update-version.js
const fs = require('fs');
const path = require('path');

// 生成时间戳作为版本号
const timestamp = new Date().getTime();

// 更新 index.html 中的版本号
const indexHtmlPath = path.join(__dirname, 'index.html');
let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');

// 替换版本号
indexHtml = indexHtml.replace(
  /(<script type="module" src="\/src\/main.jsx\?v=)([^"]+)(")/,
  `$1${timestamp}$3`
);

fs.writeFileSync(indexHtmlPath, indexHtml);
console.log(`index.html 中的版本号已更新到 ${timestamp}`);
