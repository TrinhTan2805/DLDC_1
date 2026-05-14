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

for (const file of files) {
    if (!fs.existsSync(file)) continue;
    let content = fs.readFileSync(file, 'utf8');
    
    // Step 1: Fix Content Area Background
    content = content.replace(
        /\{\/\* Content Area \*\/\}\r?\n\s*<div className="flex-1 overflow-hidden flex flex-col">/,
        '{/* Content Area */}\n          <div className="flex-1 overflow-hidden flex flex-col bg-slate-50">'
    );

    // Step 2: Replace List Tab Fragment
    content = content.replace(
        /\{activeTab === 'list' && \(\r?\n\s*<>\r?\n\s*\{\/\* Search & Actions \*\/\}\r?\n\s*<div className="[^"]*flex-shrink-0[^"]*">/,
        `{activeTab === 'list' && (
              <div className="flex-1 flex flex-col p-6 gap-4 overflow-hidden">
                {/* Search & Actions */}
                <div className="flex-shrink-0">`
    );

    // Step 3: Replace Table Start
    content = content.replace(
        /\{\/\* Table \*\/\}\r?\n\s*<div className="flex-1 overflow-auto bg-white">/,
        `{/* Table Container */}
                <div className="flex-1 flex flex-col bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                  {/* Table */}
                  <div className="flex-1 overflow-auto">`
    );

    // Step 4: Fix Pagination start (closing the table auto-scroll div but not the table container)
    content = content.replace(
        /\{\/\* Pagination \*\/\}\r?\n\s*<div className="px-\d+ py-\d+ border-t border-slate-200 flex items-center justify-between[^"]*">/,
        `</div>
                  {/* Pagination */}
                  <div className="px-4 py-3 border-t border-slate-200 flex items-center justify-between bg-white">`
    );

    // Step 5: Fix closing of the list tab
    // We look for:
    //                   </div>
    //                 </div>
    //               </>
    //             )}
    // \n\s*{activeTab === 'sync'
    // To do this safely, we use regex with the context:
    content = content.replace(
        /<\/div>\r?\n\s*<\/>\r?\n\s*\)\}\r?\n\r?\n\s*\{activeTab === 'sync'/g,
        `</div>\n                </div>\n              </div>\n            )}\n\n            {activeTab === 'sync'`
    );

    fs.writeFileSync(file, content, 'utf8');
}
console.log('Done standardizing the 11 cert modals.');
