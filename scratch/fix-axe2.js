const fs = require('fs');
const path = require('path');

const dir = 'src/components/pages/provisioning/modals';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // fix radio inputs
  content = content.replace(/<input([^>]*)type="radio"([^>]*)>/g, (match, p1, p2) => {
    if (p1.includes('aria-label') || p2.includes('aria-label')) return match;
    return '<input aria-label="Tùy chọn"' + p1 + 'type="radio"' + p2 + '>';
  });

  fs.writeFileSync(filePath, content);
}

// Also fix the tabs just in case
const dir2 = 'src/components/pages/provisioning/tabs';
if (fs.existsSync(dir2)) {
  const files2 = fs.readdirSync(dir2).filter(f => f.endsWith('.tsx'));
  for (const file of files2) {
    const filePath = path.join(dir2, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // fix radio inputs
    content = content.replace(/<input([^>]*)type="radio"([^>]*)>/g, (match, p1, p2) => {
      if (p1.includes('aria-label') || p2.includes('aria-label')) return match;
      return '<input aria-label="Tùy chọn"' + p1 + 'type="radio"' + p2 + '>';
    });

    fs.writeFileSync(filePath, content);
  }
}

console.log('Fixed radio accessibility');
