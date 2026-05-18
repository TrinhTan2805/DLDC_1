const fs = require('fs');
const file = 'src/components/pages/processing/GenericProcessingPage.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/className="text-\[20px\]/g, 'className="text-[16px]');

fs.writeFileSync(file, content);
