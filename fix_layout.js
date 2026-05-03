const fs = require('fs');
const files = fs.readdirSync('src/components').filter(f => f.endsWith('Modal.tsx'));

for (const file of files) {
  let content = fs.readFileSync('src/components/' + file, 'utf8');
  let original = content;

  // 1. Remove all <h4> headers that contain section titles like "Hồ sơ đăng ký"
  content = content.replace(/\s*<h4 className="[^"]*text-sm font-medium text-slate-900 bg-slate-100[^"]*">[^<]+<\/h4>/g, '');
  content = content.replace(/\s*<h4 className="[^"]*text-xl font-bold text-slate-900[^"]*">[^<]+<\/h4>/g, '');

  // 2. Change grid-cols-2 to flex-col inside the detail modal
  content = content.replace(/className="grid grid-cols-2 gap-3"/g, 'className="flex flex-col gap-3"');
  content = content.replace(/className="grid grid-cols-2 gap-x-8 gap-y-6"/g, 'className="flex flex-col gap-4"');

  // 3. Remove Xuat file button using Download icon
  content = content.replace(/\s*<button[^>]*>\s*<(Download|FileDown) className="w-4 h-4"\s*\/>\s*Xuất file\s*<\/button>/g, '');

  // Wait, let's also remove any grid-cols-2 inside the specific components just in case
  
  if (content !== original) {
    fs.writeFileSync('src/components/' + file, content);
    console.log('Fixed ' + file);
  }
}
