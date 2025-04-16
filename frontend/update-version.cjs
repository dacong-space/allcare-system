// 自动生成 src/utils/version.js 文件，包含版本号和构建时间戳
const fs = require('fs');
const path = require('path');

const version = require('./package.json').version;
const timestamp = Date.now();

const content = `export const APP_VERSION = '${version}';\nexport const BUILD_TIMESTAMP = '${timestamp}';\n`;

fs.writeFileSync(
  path.join(__dirname, 'src/utils/version.js'),
  content,
  'utf-8'
);

console.log('Version info updated:', { version, timestamp });
