import { execSync } from 'node:child_process';
import fs from 'node:fs';

console.log('开始打包构建...');
execSync('pnpm -r --filter=../../packages/** --stream run build');
!fs.existsSync('dist') && fs.mkdirSync('dist');

console.log('开始复制构建包...');
fs.copyFileSync('../../packages/parser/dist/lrc-parser.min.js', './dist/lrc-parser.min.js');
fs.copyFileSync('../../packages/util/dist/lrc-util.min.js', './dist/lrc-util.min.js');