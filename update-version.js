// update-version.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 生成时间戳作为版本号
const timestamp = new Date().getTime();

// 不再更新 index.html 中的版本号，因为这会导致构建错误
// 我们只在 version.js 中更新时间戳
console.log(`构建时间戳: ${timestamp}`);
console.log(`当前 package.json 中的版本号: ${JSON.parse(fs.readFileSync('./package.json', 'utf8')).version}`);

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
  console.log(`版本号将从 package.json 中自动获取`);
}

// 更新 public/version.json 文件
const versionJsonPath = path.join(__dirname, 'public', 'version.json');
if (fs.existsSync(versionJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
  const versionJson = {
    version: packageJson.version,
    buildTime: timestamp // 使用数字时间戳而不是 ISO 格式字符串
  };
  fs.writeFileSync(versionJsonPath, JSON.stringify(versionJson, null, 2));
  console.log(`public/version.json 文件已更新，版本号: ${packageJson.version}`);
}
