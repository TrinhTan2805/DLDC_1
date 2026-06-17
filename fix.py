import re

with open('src/components/pages/provisioning/modals/ProvisionServiceModal.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove TabType 'packet'
content = content.replace("type TabType = 'general' | 'protocol' | 'packet' | 'access';", "type TabType = 'general' | 'protocol' | 'access';")

# Remove the 'packet' tab from the array
content = re.sub(r"\{ id: 'packet' as TabType, label: 'Thiết kế cấu trúc gói tin', icon: <LayoutTemplate className=\"w-4 h-4\" /> \},?\n\s*", "", content)

# Remove states for packet design
content = re.sub(r"  // States for packet design \(Tab 3\).*?  const handleUpdateJoinTable = \(id: number, key: string, value: string\) => \{.*?  \};\n\n" , "", content, flags=re.DOTALL)

# Remove the functions handleAddDataField to generateDynamicPreview
content = re.sub(r"  const handleAddDataField = \(\) => \{.*?  const generateDynamicPreview = \(\) => \{.*?    return JSON.stringify\(fullResponse, null, 2\);\n  \};\n\n", "", content, flags=re.DOTALL)

# Remove the TAB 3 JSX block
content = re.sub(r"            \{\/\* TAB 3: Thiết kế cấu trúc gói tin \*\/\}.*?            \{\/\* TAB 4: Phân quyền truy cập \*\/\}", "            {/* TAB 3: Phân quyền truy cập */}", content, flags=re.DOTALL)

# Fix the steps footer
content = re.sub(r"\{\[1,2,3,4\]\.map\(step => \(", "{[1,2,3]}.map(step => (", content)
content = content.replace("(activeTab === 'packet' && step === 3) || \n", "")
content = content.replace("(activeTab === 'access' && step === 4)", "(activeTab === 'access' && step === 3)")
content = content.replace("{activeTab === 'general' ? 'Step 1 of 4' : activeTab === 'protocol' ? 'Step 2 of 4' : activeTab === 'packet' ? 'Step 3 of 4' : 'Step 4 of 4'}", "{activeTab === 'general' ? 'Step 1 of 3' : activeTab === 'protocol' ? 'Step 2 of 3' : 'Step 3 of 3'}")

# Remove mockSchema
content = re.sub(r"// Mock Database Schema for Civil Registry.*?const tableNames = Object\.keys\(mockSchema\);\n\n", "", content, flags=re.DOTALL)

with open('src/components/pages/provisioning/modals/ProvisionServiceModal.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
