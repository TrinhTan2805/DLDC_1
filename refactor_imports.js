const fs = require('fs');
let content = fs.readFileSync('src/components/layout/MainLayout.tsx', 'utf8');

let newContent = content.replace(/import\s+\{([^}]+)\}\s+from\s+['"]([^'"]+)['"];/g, (match, imports, path) => {
    if (!path.startsWith('../') || path.includes('Sidebar') || path.includes('TopBar')) return match;
    
    // Split by comma in case there are multiple imports
    const names = imports.split(',').map(n => n.trim()).filter(n => n);
    let output = '';
    for (const name of names) {
        if (name.includes(' as ')) {
            const [orig, alias] = name.split(' as ').map(n => n.trim());
            output += `const ${alias} = React.lazy(() => import('${path}').then(m => ({ default: m.${orig} })));\n`;
        } else {
            output += `const ${name} = React.lazy(() => import('${path}').then(m => ({ default: m.${name} })));\n`;
        }
    }
    return output.trim();
});

// also for default imports like import CategorySetupPage from '../pages/category/CategorySetupPage';
newContent = newContent.replace(/import\s+([A-Z][a-zA-Z0-9_]*)\s+from\s+['"]([^'"]+)['"];/g, (match, name, path) => {
    if (!path.startsWith('../') || name === 'Sidebar' || name === 'TopBar') return match;
    return `const ${name} = React.lazy(() => import('${path}'));`;
});

// Add React and Suspense
if (!newContent.includes('import React')) {
    newContent = newContent.replace("import { useState, useEffect } from 'react';", "import React, { useState, useEffect, Suspense } from 'react';");
}

// Wrap the main content with Suspense
newContent = newContent.replace('<div className="max-w-[1600px] mx-auto p-6">', '<div className="max-w-[1600px] mx-auto p-6">\n            <Suspense fallback={<div className="flex justify-center p-12"><div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>}>');
newContent = newContent.replace('</div>\n        </main>', '            </Suspense>\n          </div>\n        </main>');

fs.writeFileSync('src/components/layout/MainLayout.tsx', newContent);
console.log('Done refactoring');
