const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('src');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  content = content.replace(/(<button[^>]*?)(\s*>[\s\n]*<X\s+[^>]*>[\s\n]*<\/button>)/gm, (match, p1, p2) => {
    if (p1.includes('title=') || p1.includes('aria-label=')) return match;
    return p1 + ' title="Đóng" aria-label="Đóng"' + p2;
  });

  content = content.replace(/(<button[^>]*?)(\s*>[\s\n]*<Eye\s*[^>]*>[\s\n]*<\/button>)/gm, (match, p1, p2) => {
    if (p1.includes('title=') || p1.includes('aria-label=')) return match;
    return p1 + ' title="Xem chi tiết" aria-label="Xem chi tiết"' + p2;
  });

  content = content.replace(/(<button[^>]*?)(\s*>[\s\n]*<Pencil[A-Za-z]*\s*[^>]*>[\s\n]*<\/button>)/gm, (match, p1, p2) => {
    if (p1.includes('title=') || p1.includes('aria-label=')) return match;
    return p1 + ' title="Chỉnh sửa" aria-label="Chỉnh sửa"' + p2;
  });

  content = content.replace(/(<button[^>]*?)(\s*>[\s\n]*<Trash[A-Za-z0-9]*\s*[^>]*>[\s\n]*<\/button>)/gm, (match, p1, p2) => {
    if (p1.includes('title=') || p1.includes('aria-label=')) return match;
    return p1 + ' title="Xóa" aria-label="Xóa"' + p2;
  });

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});
console.log('Fixed buttons');
