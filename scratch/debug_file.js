const fs = require('fs');
const content = fs.readFileSync('src/components/pages/open-data/OpenDataPublishedListPage.tsx', 'utf8');
const lines = content.split('\n');
lines.forEach((line, index) => {
  if (line.includes('handleRequestSubmit')) {
    console.log(`Line ${index + 1}: ${line}`);
  }
});
