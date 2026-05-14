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

    // Standardize backdrop backgrounds to bg-black/50
    content = content.replace(/bg-black\/60/g, 'bg-black/50');
    content = content.replace(/bg-black\/40/g, 'bg-black/50');
    content = content.replace(/bg-black\/30/g, 'bg-black/50');
    content = content.replace(/bg-black\/70/g, 'bg-black/50');
    content = content.replace(/bg-black bg-opacity-50/g, 'bg-black/50');
    
    // Remove backdrop-blur-sm if it's there on modals
    content = content.replace(/backdrop-blur-sm/g, '');

    // Standardize z-index for fixed inset-0 to z-[100]
    // Common patterns: z-50, z-40, z-[60], z-[70], z-[9999]
    content = content.replace(/(fixed inset(-0|\-[^ ]+)?(?:\s+[^"']*)?)(\s+z-\d+|z-\[\d+\])/g, function(match, p1) {
        return p1 + ' z-[100]';
    });

    // Replace zIndex: \d+ inline styles for fixed inset modals
    content = content.replace(/zIndex:\s*\d+/g, 'zIndex: 100');

    // Replace rounded-xl and rounded-2xl with rounded-lg to follow 8px rule
    content = content.replace(/rounded-xl/g, 'rounded-lg');
    content = content.replace(/rounded-2xl/g, 'rounded-lg');
    
    if (content !== original) {
      // Cleanup spaces in className
      content = content.replace(/className="([^"]+)"/g, function(match, classes) {
        return 'className="' + classes.replace(/ +/g, ' ').trim() + '"';
      });
      fs.writeFileSync(filePath, content, 'utf8');
      modifiedFiles++;
    }
  }
});

console.log('Modified ' + modifiedFiles + ' files for Modals.');
