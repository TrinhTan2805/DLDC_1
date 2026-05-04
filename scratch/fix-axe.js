const fs = require('fs');
const path = require('path');

const dir = 'src/components/pages/provisioning/modals';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // fix close buttons
  content = content.replace(/<button([^>]*)onClick={onClose}([^>]*)>/g, '<button aria-label="Đóng"$1onClick={onClose}$2>');

  // fix selects
  content = content.replace(/<select([^>]*)>/g, (match, p1) => {
    if (p1.includes('aria-label')) return match;
    return '<select aria-label="Tùy chọn"' + p1 + '>';
  });

  // fix inputs
  content = content.replace(/<input([^>]*)type="text"([^>]*)>/g, (match, p1, p2) => {
    if (p1.includes('aria-label') || p2.includes('aria-label')) return match;
    return '<input aria-label="Trường nhập liệu"' + p1 + 'type="text"' + p2 + '>';
  });
  content = content.replace(/<input([^>]*)type="number"([^>]*)>/g, (match, p1, p2) => {
    if (p1.includes('aria-label') || p2.includes('aria-label')) return match;
    return '<input aria-label="Nhập số"' + p1 + 'type="number"' + p2 + '>';
  });

  fs.writeFileSync(filePath, content);
}
console.log('Fixed modals accessibility');
