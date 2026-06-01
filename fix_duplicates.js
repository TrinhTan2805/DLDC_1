const fs = require('fs');
const filesToFix = [
  'src/components/layout/Sidebar.tsx',
  'src/components/pages/admin/ConfigChangeLogPage.tsx',
  'src/components/pages/collection/CollectionSetupPage.tsx',
  'src/components/pages/orchestration/ServiceSetupPageUpdated.tsx'
];

filesToFix.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/import\s+{([^}]+)}\s+from\s+['"]lucide-react['"]/g, (match, p1) => {
    const imports = p1.split(',').map(s => s.trim()).filter(Boolean);
    const uniqueImports = [...new Set(imports)];
    return 'import { ' + uniqueImports.join(', ') + ' } from "lucide-react"';
  });
  fs.writeFileSync(file, content);
  console.log('Fixed', file);
});
