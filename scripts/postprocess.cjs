const fs = require('node:fs');
const path = require('node:path');

/**
 * 后处理：在生成的讲义页面上补充阅读进度条。
 * 课程目录与本页目录的折叠按钮已由 build-content.cjs 直接输出，
 * 此处不再重复注入，避免与新结构冲突。
 */
const build = process.argv[2] || path.resolve(__dirname, '../public');

function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    const file = path.join(dir, name);
    const stat = fs.statSync(file);
    if (stat.isDirectory()) {
      walk(file);
    } else if (name.endsWith('.html') && name !== 'index.html') {
      let html = fs.readFileSync(file, 'utf8');
      if (!html.includes('reading-progress')) {
        html = html.replace(
          '<body>',
          '<body><div class="reading-progress" id="reading-progress" aria-hidden="true"></div>'
        );
        fs.writeFileSync(file, html);
      }
    }
  }
}

walk(build);
