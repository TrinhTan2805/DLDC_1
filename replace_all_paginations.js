const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else { 
            if (file.endsWith('.tsx')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk('src');

let count = 0;

for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Look for comments like {/* Pagination */} followed by a div with border-t
    // or just a div with border-t that contains "Hiển thị"
    
    // Pattern 1: {/* Pagination */} exactly
    const paginationRegex = /\{\/\*\s*Pagination\s*\*\/\}\r?\n\s*<div[^>]*border-t[^>]*>([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>/;
    
    // It's too complex to parse randomly nested divs.
    // Instead, let's find the files that need it and manually replace or use specific regexes.
}
console.log('Total checked:', files.length);
