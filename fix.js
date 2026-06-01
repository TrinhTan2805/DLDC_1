const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'components', 'pages', 'provisioning', 'modals', 'ProvisionServiceModal.tsx');
let content = fs.readFileSync(filePath, 'utf-8');

// Remove TabType 'packet'
content = content.replace("type TabType = 'general' | 'protocol' | 'packet' | 'access';", "type TabType = 'general' | 'protocol' | 'access';");

// Remove the 'packet' tab from the array
content = content.replace(/\{ id: 'packet' as TabType, label: 'Thiết kế cấu trúc gói tin', icon: <LayoutTemplate className="w-4 h-4" \/> \},?\n\s*/g, "");

// Remove states for packet design
content = content.replace(/  \/\/ States for packet design \(Tab 3\)[\s\S]*?  const handleUpdateJoinTable = \(id: number, key: string, value: string\) => \{[\s\S]*?  \};\n\n/g, "");

// Remove the functions handleAddDataField to generateDynamicPreview
content = content.replace(/  const handleAddDataField = \(\) => \{[\s\S]*?  const generateDynamicPreview = \(\) => \{[\s\S]*?    return JSON\.stringify\(fullResponse, null, 2\);\n  \};\n\n/g, "");

// Remove the TAB 3 JSX block
content = content.replace(/            \{\/\* TAB 3: Thiết kế cấu trúc gói tin \*\/\}[\s\S]*?            \{\/\* TAB 4: Phân quyền truy cập \*\/\}/g, "            {/* TAB 3: Phân quyền truy cập */}");

// Fix the steps footer
content = content.replace(/\{\[1,2,3,4\]\.map\(step => \(/g, "{[1,2,3]}.map(step => (");
content = content.replace(/\(activeTab === 'packet' && step === 3\) \|\| \n/g, "");
content = content.replace(/\(activeTab === 'access' && step === 4\)/g, "(activeTab === 'access' && step === 3)");
content = content.replace(/\{activeTab === 'general' \? 'Step 1 of 4' : activeTab === 'protocol' \? 'Step 2 of 4' : activeTab === 'packet' \? 'Step 3 of 4' : 'Step 4 of 4'\}/g, "{activeTab === 'general' ? 'Step 1 of 3' : activeTab === 'protocol' ? 'Step 2 of 3' : 'Step 3 of 3'}");

// Remove mockSchema
content = content.replace(/\/\/ Mock Database Schema for Civil Registry[\s\S]*?const tableNames = Object\.keys\(mockSchema\);\n\n/g, "");

fs.writeFileSync(filePath, content, 'utf-8');
console.log("Replaced successfully!");
