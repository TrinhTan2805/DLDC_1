const fs = require('fs');
const path = require('path');

const srcDir = 'd:/tuphap/khodldc/dldc_1/src/components/pages';
const outputFile = 'd:/tuphap/khodldc/dldc_1/full_audit.md';

let md = '# TÀI LIỆU RÀ SOÁT TÍNH NĂNG POPUP TRÊN TOÀN HỆ THỐNG\n\n';
md += 'Tài liệu này đánh giá hiện trạng các thành phần tương tác (Button, Action) cho **TẤT CẢ** các Phân hệ (Modules) trong hệ thống.\n\n';

md += '## Ghi chú Trạng thái Popup\n';
md += '- ✅ **Có Popup (Hoàn chỉnh)**: Thao tác gọi một Modal Component (React Portal, Dialog) riêng biệt để xử lý.\n';
md += '- ℹ️ **Điều hướng / API / Action Ngầm**: Các nút bấm có mục đích mở một Tab khác, xác nhận hành động trực tiếp mà không cần confirm, hoặc để tắt màn hình.\n';
md += '- ❌ **Popup Cảnh báo/Chưa hoàn thiện**: Các thao tác gọi hàm Alert mặc định của trình duyệt (`alert(...)`) thay vì sử dụng Modal chuẩn của dự án.\n\n';

function walkDir(dir, fileList = []) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const file of files) {
    if (file.isDirectory() && file.name !== 'components') { // Optionally skip purely structural sub-components if they don't contain pages, but we do need inside components/tabs
      walkDir(path.join(dir, file.name), fileList);
    } else if (file.isDirectory() && file.name === 'components') {
      walkDir(path.join(dir, file.name), fileList);
    } else if (file.name.endsWith('.tsx')) {
      // Focus on Pages, Tabs, Modal definitions
      if (file.name.includes('Page') || file.name.includes('Tab') || file.name.includes('List')) {
         fileList.push(path.join(dir, file.name));
      }
    }
  }
  return fileList;
}

const allFiles = walkDir(srcDir);

// Group by module (the parent folder inside src/components/pages)
const modules = {};

allFiles.forEach(filePath => {
  const relPath = path.relative(srcDir, filePath);
  const parts = relPath.split(path.sep);
  const moduleName = parts[0] === 'components' ? parts[0] : parts[0]; 
  
  if (!modules[moduleName]) modules[moduleName] = [];
  modules[moduleName].push(filePath);
});

for (const moduleName in modules) {
  md += `---\n\n# MODULE: ${moduleName.toUpperCase()}\n\n`;
  const moduleFiles = modules[moduleName];
  
  for (const filePath of moduleFiles) {
    const fileName = path.basename(filePath);
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Regex to find buttons
    const btnRegex = /<button[^>]*onClick=\{([^\}]+)\}[^>]*>([\s\S]*?)<\/button>/g;
    const buttons = [];
    let match;
    const seen = new Set();
    
    while ((match = btnRegex.exec(content)) !== null) {
      const onClick = match[1];
      let innerText = match[2].replace(/<[^>]+>/g, '').trim().replace(/\s+/g, ' ');
      const titleMatch = match[0].match(/title=["']([^"']+)["']/);
      const title = titleMatch ? titleMatch[1] : '';
      let name = (innerText || title || 'Icon Button').substring(0, 50);
      
      const key = name + onClick;
      if (seen.has(key)) continue;
      seen.add(key);
      
      let cleanAction = onClick.replace(/\\r?\\n|\\r|\\t/g, ' ').replace(/\\s+/g, ' ').trim();
      let shortAction = cleanAction.substring(0, 60);
      if (cleanAction.length > 60) shortAction += '...';
      
      // Determine status
      let status = 'ℹ️ Action Ngầm / Điều hướng';
      if (cleanAction.includes('setShow') && cleanAction.includes('true')) status = '✅ Dùng trạng thái Modal Form';
      else if (cleanAction.includes('Modal') || cleanAction.includes('Dialog')) status = '✅ Đóng/Mở Modal';
      else if (cleanAction.includes('setShow') && cleanAction.includes('false')) status = 'ℹ️ Nút Đóng Popup';
      else if (cleanAction.toLowerCase().includes('alert(')) status = '❌ Cảnh báo Alert Browser (Cần nâng cấp)';
      else if (cleanAction.includes('navigate') || cleanAction.includes('Link')) status = '🔗 Chuyển trang/Routing';
      
      // Classify common icon buttons
      if (name.includes('Icon Button') || name === '') {
        if (cleanAction.includes('Close') || cleanAction.includes('false')) name = 'Nút Đóng (Icon X)';
        else if (cleanAction.includes('Delete') || cleanAction.includes('Trash')) name = 'Nút Xóa (Icon Trash)';
        else if (cleanAction.includes('Edit')) name = 'Nút Sửa (Icon Edit)';
        else if (cleanAction.includes('Add')) name = 'Nút Thêm (Icon Plus)';
        else name = 'Nút điều khiển tự do (Icon)';
      }
      
      buttons.push({ name, action: shortAction, status });
    }
    
    if (buttons.length > 0) {
      md += `### File: \`${path.relative(srcDir, filePath).replace(/\\/g, '/')}\`\n`;
      md += '| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup |\n';
      md += '|---|---|---|\n';
      buttons.forEach(b => {
        md += `| **${b.name.replace(/\\r?\\n/g, '')}** | \`${b.action.replace(/\\|/g, '\\|')}\` | ${b.status} |\n`;
      });
      md += '\n';
    }
  }
}

fs.writeFileSync(outputFile, md, 'utf-8');
console.log('Done writing markdown');
