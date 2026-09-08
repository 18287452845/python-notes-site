const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(process.env.SITE_OUTPUT_DIR || path.join(__dirname, '..', 'public'));
let pages = 0;
let failures = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(file);
    else if (entry.name.endsWith('.html')) {
      pages += 1;
      const html = fs.readFileSync(file, 'utf8');
      if (entry.name !== 'index.html') {
        if (!html.includes('<aside class="lesson-toc"')) failures.push(`${file}: missing page toc`);
        if (!html.includes('course-nav-toggle')) failures.push(`${file}: missing course nav toggle`);
      }
    }
  }
}
walk(root);
for (const file of ['style.css', 'script.js', 'assets/highlight.common.min.js', 'assets/highlight.github-dark.min.css']) {
  if (!fs.existsSync(path.join(root, file))) failures.push(`missing ${file}`);
}
if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log(`site check passed: ${pages} html pages`);
