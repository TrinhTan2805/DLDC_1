const fs = require('fs');
const path = require('path');

const filesToPatch = [
  'src/components/pages/internal/LegalNationalPage.tsx',
  'src/components/pages/internal/CivilLegalCenterPage.tsx',
  'src/components/pages/internal/CivilLegalInfoPage.tsx',
  'src/components/pages/internal/FamilyBasePage.tsx',
  'src/components/pages/internal/AuctionPage.tsx',
  'src/components/pages/internal/InternationalPage.tsx',
  'src/components/pages/internal/StatisticsCollectionPage.tsx',
  'src/components/pages/internal/LegalCenterPage.tsx'
];

for (const file of filesToPatch) {
  const fullPath = path.join(__dirname, file);
  if (!fs.existsSync(fullPath)) {
    console.log(`Skipping ${file} - not found`);
    continue;
  }
  let content = fs.readFileSync(fullPath, 'utf8');

  // Check if it already has an interface for props
  const propsMatch = content.match(/interface\s+([A-Za-z]+Props)\s*\{/);
  
  if (propsMatch) {
    const interfaceName = propsMatch[1];
    
    // Check if onBack is missing
    if (!content.includes('onBack?')) {
      content = content.replace(
        new RegExp(`interface\\s+${interfaceName}\\s*\\{`),
        `interface ${interfaceName} {\n  onBack?: () => void;`
      );
    }
    if (!content.includes('mode?')) {
      content = content.replace(
        new RegExp(`interface\\s+${interfaceName}\\s*\\{`),
        `interface ${interfaceName} {\n  mode?: string;`
      );
    }
    if (!content.includes('context?')) {
      content = content.replace(
        new RegExp(`interface\\s+${interfaceName}\\s*\\{`),
        `interface ${interfaceName} {\n  context?: string;`
      );
    }
    fs.writeFileSync(fullPath, content);
    console.log(`Patched interface in ${file}`);
  } else {
    // If no interface, replace `export function ComponentName() {` with `export function ComponentName({ onBack, mode, context }: { onBack?: () => void, mode?: string, context?: string }) {`
    // Find the export function declaration
    const funcMatch = content.match(/export\s+function\s+([A-Za-z]+)\s*\(\)\s*\{/);
    if (funcMatch) {
      const funcName = funcMatch[1];
      content = content.replace(
        new RegExp(`export\\s+function\\s+${funcName}\\s*\\(\\)\\s*\\{`),
        `export function ${funcName}({ onBack, mode, context }: { onBack?: () => void, mode?: string, context?: string }) {`
      );
      fs.writeFileSync(fullPath, content);
      console.log(`Patched function params in ${file}`);
    } else {
      console.log(`Could not find export function in ${file}`);
    }
  }
}
