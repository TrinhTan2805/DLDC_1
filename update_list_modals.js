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

    // 1. Update Content Area background
    content = content.replace(/\{\/\* Content Area \*\/\}\s*<div className="flex-1 overflow-hidden flex flex-col">/g, '{/* Content Area */}\n          <div className="flex-1 overflow-hidden flex flex-col bg-slate-50">');

    // 2. Wrap list tab in a padded flex container instead of <>
    content = content.replace(/\{activeTab === 'list' && \(\s*<>\s*\{\/\* Search & Actions \*\/\}/g, "{activeTab === 'list' && (\n              <div className=\"flex-1 flex flex-col p-6 gap-4 overflow-hidden\">\n                {/* Search & Actions */}");

    // 3. Remove border-b, px-4, py-3, bg-white from Search & Actions
    content = content.replace(/\{\/\* Search & Actions \*\/\}\s*<div className="px-4 py-3 border-b border-slate-200 flex-shrink-0 bg-white">/g, '{/* Search & Actions */}\n                <div className="flex-shrink-0">');

    // 4. Wrap Table and Pagination in a white card
    content = content.replace(/\{\/\* Table \*\/\}\s*<div className="flex-1 overflow-auto bg-white">/g, '{/* Table Container */}\n                <div className="flex-1 flex flex-col bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">\n                  {/* Table */}\n                  <div className="flex-1 overflow-auto">');

    // 5. Close the overflow-auto div before Pagination and update Pagination background
    content = content.replace(/\{\/\* Pagination \*\/\}\s*<div className="px-4 py-3 border-t border-slate-200 flex items-center justify-between bg-slate-50\/50">/g, '</div>\n                  {/* Pagination */}\n                  <div className="px-4 py-3 border-t border-slate-200 flex items-center justify-between bg-white">');

    // 6. Close the Table Container after Pagination
    // The previous structure was:
    //                   </div>
    //                 </div>
    //               </>
    //             )}
    // Now it should be:
    //                   </div>
    //                 </div>
    //               </div>
    //             )}
    // We can do this by matching the end of Pagination and changing </> to </div>
    // It's safer to just replace `</>\n            )}` with `</div>\n            )}` in the vicinity, but there could be other `</>`.
    // Let's replace the specific block closure for activeTab === 'list'.
    content = content.replace(/<\/>\s*\n\s*\)\}/g, '</div>\n            )}');

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        modifiedCount++;
    }
}

console.log('Modified ' + modifiedCount + ' files.');
