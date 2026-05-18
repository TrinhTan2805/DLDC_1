const fs = require('fs');

const processFile = (filePath, startLine = 0) => {
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }
  let content = fs.readFileSync(filePath, 'utf-8');
  let lines = content.split('\n');
  for (let i = startLine; i < lines.length; i++) {
    lines[i] = lines[i].replace(/text-base/g, 'text-[13px]')
                       .replace(/text-sm/g, 'text-[13px]')
                       .replace(/text-xs/g, 'text-[13px]')
                       .replace(/text-\[14px\]/g, 'text-[13px]')
                       .replace(/text-\[15px\]/g, 'text-[13px]')
                       .replace(/text-\[16px\]/g, 'text-[13px]');
  }
  fs.writeFileSync(filePath, lines.join('\n'), 'utf-8');
  console.log(`Processed ${filePath}`);
};

processFile('f:/BTP/DLDC_1/src/components/pages/collection/ServiceModals.tsx', 230);
processFile('f:/BTP/DLDC_1/src/components/pages/collection/ConnectionConfigSection.tsx', 0);
processFile('f:/BTP/DLDC_1/src/components/pages/collection/DataCollectionConfigSection.tsx', 0);
processFile('f:/BTP/DLDC_1/src/components/pages/collection/StructureLoadingConfig.tsx', 0);

console.log('All done');
