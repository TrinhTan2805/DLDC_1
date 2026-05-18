const fs = require('fs');
const files = [
  'src/components/pages/processing/GenericProcessingPage.tsx',
  'src/components/pages/processing/DataMappingModal.tsx',
  'src/components/pages/processing/SelectTargetDatabaseModal.tsx',
  'src/components/pages/processing/TargetDatabaseConfigModal.tsx',
  'src/components/pages/processing/ScheduleManagementModal.tsx'
];
for(const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/<p-\[13px\]([^>]*)/g, '<p className="text-[13px] ');
  fs.writeFileSync(file, content);
}
