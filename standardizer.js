const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

let modifiedFiles = 0;
walkDir('./src', function(filePath) {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // 1. Replace font-bold, font-semibold with font-medium
    content = content.replace(/\bfont-bold\b/g, 'font-medium');
    content = content.replace(/\bfont-semibold\b/g, 'font-medium');

    // 2. Replace specific text sizes with standard tailwind ones based on guidelines
    content = content.replace(/text-\[10px\]/g, 'text-xs');
    content = content.replace(/text-\[11px\]/g, 'text-xs');
    content = content.replace(/text-\[13px\]/g, 'text-sm');
    content = content.replace(/text-\[14px\]/g, 'text-sm');
    content = content.replace(/text-\[15px\]/g, 'text-base');
    
    // 3. Fix colors. text-slate-800 or text-slate-900 -> text-slate-950 (Foreground)
    content = content.replace(/text-slate-800/g, 'text-slate-950');
    content = content.replace(/text-slate-900/g, 'text-slate-950');
    
    // 4. Table Header standardizations
    // remove uppercase and tracking-wider in th classes
    content = content.replace(/(<th\b[^>]*className="[^"]*)uppercase tracking-wider([^"]*")/g, '$1$2');
    content = content.replace(/(<th\b[^>]*className="[^"]*)uppercase([^"]*")/g, '$1$2');
    content = content.replace(/(<th\b[^>]*className="[^"]*)tracking-wider([^"]*")/g, '$1$2');
    
    // text-xs in th -> text-sm
    content = content.replace(/(<th\b[^>]*className="[^"]*)text-xs([^"]*")/g, '$1text-sm$2');
    
    // px-6 py-4 to px-4 py-3
    content = content.replace(/px-6 py-4/g, 'px-4 py-3');
    
    // Fix multi spaces inside class name (optional but clean)
    content = content.replace(/(<th\b[^>]*className=")([^"]+)(")/g, function(match, p1, p2, p3) {
        return p1 + p2.replace(/\s+/g, ' ').trim() + p3;
    });

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      modifiedFiles++;
    }
  }
});

console.log('Modified ' + modifiedFiles + ' files.');
