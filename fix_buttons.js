const fs = require('fs');
let content = fs.readFileSync('src/components/pages/category/CategoryPage.tsx', 'utf-8');

// Replace <button> tags that only contain <X ... /> with <button title="Đóng">
content = content.replace(/<button([^>]*)>\s*<X\s+className="[^"]+"\s*\/>\s*<\/button>/g, (match, p1) => {
  if (p1.includes('title=')) return match;
  return `<button title="Đóng"${p1}>\n                <X className="w-5 h-5" />\n              </button>`;
});

fs.writeFileSync('src/components/pages/category/CategoryPage.tsx', content);
console.log('Fixed buttons.');
