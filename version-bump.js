// version-bump.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 读取命令行参数
const args = process.argv.slice(2);
const bumpType = args[0] || 'patch'; // 默认为修订号递增

// 读取 package.json
const packageJsonPath = path.join(__dirname, 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const currentVersion = packageJson.version;

// 解析版本号
const [major, minor, patch] = currentVersion.split('.').map(Number);

// 根据类型递增版本号
let newVersion;
switch (bumpType) {
  case 'major':
    newVersion = `${major + 1}.0.0`;
    break;
  case 'minor':
    newVersion = `${major}.${minor + 1}.0`;
    break;
  case 'patch':
  default:
    newVersion = `${major}.${minor}.${patch + 1}`;
    break;
}

// 更新 package.json
packageJson.version = newVersion;
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

console.log(`版本号已从 ${currentVersion} 更新到 ${newVersion}`);

// 不再更新 version.js 中的版本号，因为现在版本号是从环境变量中获取的
console.log(`版本号将从 package.json 中自动获取，不需要手动更新 version.js`);

// 检查 CHANGELOG.md 是否存在
const changelogPath = path.join(__dirname, 'CHANGELOG.md');
if (fs.existsSync(changelogPath)) {
  // 获取当前日期
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const dateStr = `${year}-${month}-${day}`;
  
  console.log('\n\x1b[33m请记得更新 CHANGELOG.md 文件\x1b[0m');
  console.log('\n建议添加的内容:');
  console.log(`\n## [${newVersion}] - ${dateStr}\n`);
  console.log('### 新增');
  console.log('- ');
  console.log('\n### 变更');
  console.log('- ');
  console.log('\n### 修复');
  console.log('- ');
}
