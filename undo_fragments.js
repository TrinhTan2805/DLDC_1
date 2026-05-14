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
    
    // Reverse the replacement:
    // "</div>\n                </div>\n              </div>\n            )}"
    // to
    // "</>\n            )}"
    
    // We used: /<\/>(\r?\n\s*\)\})/g -> "</div>\n                </div>\n              </div>$1"
    
    const regex = /<\/div>\r?\n\s*<\/div>\r?\n\s*<\/div>(\r?\n\s*\)\})/g;
    
    if (content.match(regex)) {
        console.log("Reverting fragment in:", file);
        content = content.replace(regex, "<\/>$1");
        fs.writeFileSync(file, content, 'utf8');
    }
}
