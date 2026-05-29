const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = dir + '/' + file;
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('src');
files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  // Match all imports
  const matches = [...content.matchAll(/import\s+{([^}]+)}\s+from\s+['"]lucide-react['"]/g)];
  matches.forEach(match => {
    const imports = match[1].split(',').map(s => s.trim().split(/\s+as\s+/)[0]).filter(Boolean);
    const duplicates = imports.filter((item, index) => imports.indexOf(item) !== index);
    if (duplicates.length > 0) {
      console.log('DUPLICATE in', file, duplicates);
    }
  });
});
