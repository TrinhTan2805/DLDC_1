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

const files = walk('src/components');

for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Replace `</>` followed by `)}`
    // with `</div>\n</div>\n</div>\n)}`
    // Since we know the context is `</>` at the end of the content area.
    
    const regex = /<\/>(\r?\n\s*\)\})/g;
    
    if (content.match(regex)) {
        console.log("Fixing fragment in:", file);
        content = content.replace(regex, "</div>\n                </div>\n              </div>$1");
        fs.writeFileSync(file, content, 'utf8');
    }
}
