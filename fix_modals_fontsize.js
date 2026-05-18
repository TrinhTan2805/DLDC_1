const fs = require('fs');
const path = require('path');
const dir = 'src/components/pages/processing';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

for(const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  if (content.includes("fontSize: '16px'")) {
    content = content.replace(/fontSize: '16px'/g, "fontSize: '13px'");
    changed = true;
  }
  if (content.includes('fontSize: "16px"')) {
    content = content.replace(/fontSize: "16px"/g, "fontSize: '13px'");
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, content);
    console.log('Fixed:', file);
  }
}
