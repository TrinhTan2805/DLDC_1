const fs = require('fs');

const files = [
    'src/components/TerminationGuardianshipCertModal.tsx',
    'src/components/TerminationGuardianshipMonitoringModal.tsx',
    'src/components/ParentChildRecognitionModal.tsx',
    'src/components/MarriageDetailModal.tsx',
    'src/components/MaritalStatusCertModal.tsx',
    'src/components/GuardianshipCertModal.tsx',
    'src/components/GuardianshipMonitoringModal.tsx',
    'src/components/DeathCertModal.tsx',
    'src/components/CivilRegistryChangeModal.tsx',
    'src/components/BirthCertDetailModal.tsx',
    'src/components/AdoptionCertModal.tsx'
];

const targetHtml = `                  {/* Pagination */}
                  <div className="px-4 py-3 border-t border-slate-200 flex items-center justify-between bg-white">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-600">Hiển thị</span>
                      <select 
                        className="px-2 py-1 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        title="Số bản ghi trên trang"
                      >
                        <option>10</option>
                        <option>20</option>
                        <option>50</option>
                        <option>100</option>
                      </select>
                      <span className="text-sm text-slate-600">bản ghi/trang</span>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-slate-600">1 - {records.length} / {totalRecords}</span>
                      <div className="flex items-center gap-1">
                        <button className="px-3 py-1.5 border border-slate-200 rounded text-slate-400 cursor-not-allowed text-sm">Trước</button>
                        <button className="px-3 py-1.5 border border-blue-600 bg-blue-600 text-white rounded text-sm font-medium">1</button>
                        <button className="px-3 py-1.5 border border-slate-200 rounded hover:bg-slate-50 text-slate-700 text-sm">2</button>
                        <button className="px-3 py-1.5 border border-slate-200 rounded hover:bg-slate-50 text-slate-700 text-sm">Sau</button>
                      </div>
                    </div>
                  </div>`;

for (const file of files) {
    if (!fs.existsSync(file)) continue;
    let content = fs.readFileSync(file, 'utf8');
    
    // Use regex to match the old pagination block
    const regex = /\{\/\* Pagination \*\/\}\r?\n\s*<div className="px-4 py-3 border-t border-slate-200 flex items-center justify-between bg-white">\r?\n\s*<div className="text-sm text-slate-600 font-medium">\r?\n\s*Hiển thị <span className="text-slate-900 font-bold">1-\{records\.length\}<\/span> trong tổng số <span className="text-slate-900 font-bold">\{totalRecords\}<\/span> bản ghi\r?\n\s*<\/div>\r?\n\s*<div className="flex items-center gap-2">\r?\n\s*<button[^>]*>Trước<\/button>\r?\n\s*<button[^>]*>1<\/button>\r?\n\s*<button[^>]*>Sau<\/button>\r?\n\s*<\/div>\r?\n\s*<\/div>/g;
    
    if (regex.test(content)) {
        content = content.replace(regex, targetHtml);
        fs.writeFileSync(file, content, 'utf8');
        console.log('Updated', file);
    } else {
        console.log('Not found in', file);
    }
}
