const fs = require('fs');
let pageContent = fs.readFileSync('f:\\BTP\\DLDC_1\\src\\components\\pages\\admin\\GroupManagementPage.tsx', 'utf-8');
let jsonContent = fs.readFileSync('f:\\BTP\\DLDC_1\\src\\components\\layout\\extracted_menu.json', 'utf-8');

// Find the start and end of menuStructure
let startStr = 'const menuStructure: MenuItem[] = [';
let endStr = '];\n\nconst dataSources = [';
let start = pageContent.indexOf(startStr);
let end = pageContent.indexOf(endStr, start);

if (start !== -1 && end !== -1) {
  let newContent = pageContent.substring(0, start) + 'const menuStructure: MenuItem[] = ' + jsonContent + ';\n\nconst dataSources = [' + pageContent.substring(end + endStr.length);
  fs.writeFileSync('f:\\BTP\\DLDC_1\\src\\components\\pages\\admin\\GroupManagementPage.tsx', newContent);
  console.log('Replaced menuStructure successfully!');
} else {
  console.log('Could not find bounds of menuStructure');
}
