const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const siteRoot = path.resolve(__dirname, '..');
const contentRoot = process.env.CONTENT_DIR || path.resolve(siteRoot, '../../python-notes-content');
const out = process.env.SITE_OUTPUT_DIR || path.join(siteRoot, 'public');
const groups = ['01-基础语法','02-数据结构','03-函数与模块','04-文件与异常','05-面向对象','06-基础项目','拓展-办公自动化','拓展-Web与爬虫','拓展-数据分析','拓展-机器学习'];

fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });

const run = (script, args = []) => {
  const result = spawnSync(process.execPath, [path.join(__dirname, script), ...args], {
    stdio: 'inherit',
    env: { ...process.env, CONTENT_DIR: contentRoot },
  });
  if (result.status !== 0) process.exit(result.status || 1);
};

run('build-content.cjs', [out]);

fs.copyFileSync(path.join(siteRoot, 'templates', 'style.css'), path.join(out, 'style.css'));
fs.copyFileSync(path.join(siteRoot, 'templates', 'script.js'), path.join(out, 'script.js'));
fs.mkdirSync(path.join(out, 'assets'), { recursive: true });
for (const file of ['highlight.common.min.js', 'highlight.github-dark.min.css']) {
  fs.copyFileSync(path.join(siteRoot, 'templates', file), path.join(out, 'assets', file));
}

function copyFiles(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const source = path.join(dir, entry.name);
    if (entry.isDirectory()) copyFiles(source);
    else fs.copyFileSync(source, path.join(out, 'assets', entry.name));
  }
}
for (const group of groups) copyFiles(path.join(contentRoot, group, 'assets'));

run('postprocess.cjs', [out]);
