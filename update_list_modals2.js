const fs = require('fs');
const path = require('path');

const targetFiles = [
    'src/components/TerminationGuardianshipCertModal.tsx',
    'src/components/TerminationGuardianshipMonitoringModal.tsx',
    'src/components/ParentChildRecognitionModal.tsx',
    'src/components/MarriageDetailModal.tsx',
    'src/components/MaritalStatusCertModal.tsx',
    'src/components/GuardianshipCertModal.tsx',
    'src/components/GuardianshipMonitoringModal.tsx',
    'src/components/DeathCertModal.tsx',
    'src/components/DataDetailModal.tsx',
    'src/components/CivilRegistryChangeModal.tsx',
    'src/components/BirthCertDetailModal.tsx',
    'src/components/AdoptionCertModal.tsx'
];

let modifiedCount = 0;

for (const file of targetFiles) {
    if (!fs.existsSync(file)) continue;
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // 1. Content Area background
    content = content.replace(/\{\/\* Content Area \*\/\}\r?\n\s*<div className="flex-1 overflow-hidden flex flex-col( bg-slate-50)?">/g, '{/* Content Area */}\n          <div className="flex-1 overflow-hidden flex flex-col bg-slate-50">');

    // 2. Active tab wrapper
    content = content.replace(/\{activeTab === 'list' && \(\r?\n\s*<>\r?\n\s*\{\/\* Search & Actions \*\/\}/g, "{activeTab === 'list' && (\n              <div className=\"flex-1 flex flex-col p-6 gap-4 overflow-hidden\">\n                {/* Search & Actions */}");

    // 3. Search & Actions container
    content = content.replace(/\{\/\* Search & Actions \*\/\}\r?\n\s*<div className="(px-\d+ py-\d+ border-b border-slate-200 )?flex-shrink-0( bg-white)?( shadow-sm)?">/g, '{/* Search & Actions */}\n                <div className="flex-shrink-0">');

    // 4. Table Wrapper
    content = content.replace(/\{\/\* Table \*\/\}\r?\n\s*<div className="flex-1 overflow-auto bg-white">/g, '{/* Table Container */}\n                <div className="flex-1 flex flex-col bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">\n                  {/* Table */}\n                  <div className="flex-1 overflow-auto">');

    // 5. Pagination
    content = content.replace(/\{\/\* Pagination \*\/\}\r?\n\s*<div className="px-\d+ py-\d+ border-t border-slate-200 flex items-center justify-between( bg-slate-50\/50| bg-white)">/g, '</div>\n                  {/* Pagination */}\n                  <div className="px-4 py-3 border-t border-slate-200 flex items-center justify-between bg-white">');

    // 6. Close the wrappers
    content = content.replace(/<\/div>\r?\n\s*<\/>\r?\n\s*\)\}/g, '</div>\n                </div>\n              </div>\n            )}');

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        modifiedCount++;
    }
}

console.log('Modified ' + modifiedCount + ' files.');
