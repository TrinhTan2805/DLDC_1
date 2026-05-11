const fs = require('fs');
const path = require('path');

const filePaths = [
    'src/components/pages/collection/ViewServiceModal.tsx',
    'src/components/pages/collection/SourceSystemDetailModal.tsx',
    'src/components/pages/collection/AgentDetailModal.tsx'
];

for (const filePath of filePaths) {
    const fullPath = path.resolve(filePath);
    if (!fs.existsSync(fullPath)) continue;
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Replace font-bold with font-medium in specific data field contexts
    // e.g. <div className="... text-slate-900 font-bold ...">{data}</div>
    // We will specifically look for font-bold that are on text-sm elements that are NOT headings or tabs.
    // Also replacing font-semibold if used similarly.
    
    content = content.replace(/(className=["'][^"']*)font-bold([^"']*["'])/g, (match, p1, p2) => {
        // Exclude headings or specific UI elements that should remain bold
        if (
            match.includes('text-xl') || 
            match.includes('text-2xl') || 
            match.includes('text-lg') || 
            match.includes('text-xs') || // usually headers like "THÔNG TIN CHUNG"
            match.includes('uppercase') ||
            match.includes('border-') // might be a pill/badge, wait, "border" is used in badges
        ) {
            return match;
        }
        return p1 + 'font-medium' + p2;
    });

    fs.writeFileSync(fullPath, content, 'utf8');
    console.log('Updated', filePath);
}
