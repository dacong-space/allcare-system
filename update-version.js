// update-version.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// 更新 version.js 文件中的时间戳
const versionJsPath = path.join(__dirname, 'src', 'utils', 'version.js');
if (fs.existsSync(versionJsPath)) {
  let versionJs = fs.readFileSync(versionJsPath, 'utf8');

  // 替换时间戳
  versionJs = versionJs.replace(
    /export const BUILD_TIMESTAMP = ['"](.*)['"];/,
    `export const BUILD_TIMESTAMP = '${timestamp}';`
  );

  fs.writeFileSync(versionJsPath, versionJs);
  console.log(`version.js 中的时间戳已更新到 ${timestamp}`);
}
