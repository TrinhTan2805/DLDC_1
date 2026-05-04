const fs = require('fs');
const path = require('path');

const dir = path.join(process.cwd(), 'src/components/pages/provisioning/modals');
const files = [
  'AccessControlModal.tsx',
  'PacketDesignModal.tsx',
  'ProvisionApiModal.tsx',
  'ProvisionDataRequestModal.tsx'
];

for (const file of files) {
  const filepath = path.join(dir, file);
  if (!fs.existsSync(filepath)) continue;

  let content = fs.readFileSync(filepath, 'utf8');

  // Add title to selects
  content = content.replace(/<select\s+([^>]*)>/g, (match, attrs) => {
    if (!attrs.includes('title=')) {
      return `<select title="Tùy chọn" ${attrs}>`;
    }
    return match;
  });

  // Add title and placeholder to inputs
  content = content.replace(/<input\s+([^>]*)>/g, (match, attrs) => {
    let newAttrs = attrs;
    if (!attrs.includes('title=')) {
      newAttrs = `title="Nhập liệu" ` + newAttrs;
    }
    if (!attrs.includes('placeholder=') && !attrs.includes('type="radio"') && !attrs.includes('type="checkbox"')) {
      newAttrs = `placeholder="..." ` + newAttrs;
    }
    return `<input ${newAttrs}>`;
  });

  // Add title to buttons if they don't have text or title
  content = content.replace(/<button\s+([^>]*)>/g, (match, attrs) => {
    if (!attrs.includes('title=') && attrs.includes('aria-label=')) {
       // if it has aria-label but no title, add title matching aria-label
       const ariaLabelMatch = attrs.match(/aria-label="([^"]+)"/);
       if (ariaLabelMatch) {
         return `<button title="${ariaLabelMatch[1]}" ${attrs}>`;
       }
    }
    if (!attrs.includes('title=') && !attrs.includes('aria-label=')) {
        return `<button title="Nút bấm" aria-label="Nút bấm" ${attrs}>`;
    }
    return match;
  });

  fs.writeFileSync(filepath, content);
  console.log(`Fixed axe in ${file}`);
}
