const fs = require('fs');
const path = require('path');

const targetDirs = [
  'category',
  'master-data',
  'open-data'
];
const baseDir = 'd:/tuphap/khodldc/dldc_1/src/components/pages';

const results = [];

function scanDir(dirName) {
  const fullPath = path.join(baseDir, dirName);
  if (!fs.existsSync(fullPath)) return;
  
  const files = fs.readdirSync(fullPath, { withFileTypes: true });
  for (const file of files) {
    if (file.isDirectory() && file.name !== 'components') {
      // scanDir(path.join(dirName, file.name)); 
      // let's just stick to the main pages
    } else if (file.name.endsWith('Page.tsx') || file.name.endsWith('Tab.tsx')) {
      const filePath = path.join(fullPath, file.name);
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Look for buttons or ActionIconButton
      // <button ... onClick={...}> ... </button>
      const btnRegex = /<button[^>]*onClick=\{([^\}]+)\}[^>]*>([\s\S]*?)<\/button>/g;
      const buttons = [];
      let match;
      while ((match = btnRegex.exec(content)) !== null) {
        const onClick = match[1];
        const innerText = match[2].replace(/<[^>]+>/g, '').trim().replace(/\s+/g, ' ');
        // Check if there's a title attribute since some are icon only
        const titleMatch = match[0].match(/title=["']([^"']+)["']/);
        const title = titleMatch ? titleMatch[1] : '';
        const name = (innerText || title || 'Icon Button').substring(0, 50);
        
        const hasPopup = onClick.includes('setShow') || onClick.includes('Modal') || onClick.includes('setOpen');
        buttons.push({ name, hasPopup, action: onClick });
      }
      
      if (buttons.length > 0) {
        results.push({
          file: file.name,
          module: dirName,
          buttons: buttons
        });
      }
    }
  }
}

targetDirs.forEach(scanDir);
fs.writeFileSync('button_audit.json', JSON.stringify(results, null, 2));
