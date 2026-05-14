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
            if (file.endsWith('Modal.tsx')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk('src/components');

for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Look for:
    //                   </div>
    //                 </div>
    //               </div>
    //             )}
    // 
    //             {activeTab === 'sync' && (
    
    // We want to replace 3 closing divs with 2 closing divs before `)}` and `activeTab === 'sync'`
    // Actually, a more precise regex:
    const regex = /<\/div>\r?\n\s*<\/div>\r?\n\s*<\/div>\r?\n\s*\)\}\r?\n\r?\n\s*\{activeTab === 'sync'/g;
    
    if (content.match(regex)) {
        console.log("Fixing:", file);
        content = content.replace(
            /<\/div>(\r?\n\s*)<\/div>(\r?\n\s*)<\/div>(\r?\n\s*\)\}\r?\n\r?\n\s*\{activeTab === 'sync')/g,
            "<\/div>$2<\/div>$3"
        );
        fs.writeFileSync(file, content, 'utf8');
    }
}
