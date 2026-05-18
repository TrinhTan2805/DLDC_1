const fs = require('fs');
const file = 'src/components/pages/processing/GenericProcessingPage.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/style=\{\{ fontSize: '16px' \}\}/g, "style={{ fontSize: '13px' }}");
content = content.replace(/text-\[16px\]/g, "text-[13px]");
content = content.replace(/<span className="text-3xl /g, '<span className="text-[20px] ');

fs.writeFileSync(file, content);
