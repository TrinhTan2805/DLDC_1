const fs = require('fs');
const filePath = 'f:/BTP/DLDC_1/src/components/pages/collection/ViewServiceModal.tsx';
let content = fs.readFileSync(filePath, 'utf-8');

// We want to replace text-base, text-sm, text-xs, text-[15px] with text-[13px]
// But ONLY after line 190.

const lines = content.split('\n');
for (let i = 190; i < lines.length; i++) {
  lines[i] = lines[i].replace(/text-base/g, 'text-[13px]');
  lines[i] = lines[i].replace(/text-sm/g, 'text-[13px]');
  lines[i] = lines[i].replace(/text-xs/g, 'text-[13px]');
  lines[i] = lines[i].replace(/text-\[15px\]/g, 'text-[13px]');
  lines[i] = lines[i].replace(/text-\[14px\]/g, 'text-[13px]');
}

fs.writeFileSync(filePath, lines.join('\n'), 'utf-8');
console.log('Done');
