const fs = require('fs');
const path = require('path');

const srcDir = 'd:/tuphap/khodldc/dldc_1/src/components';
const outputFile = 'd:/tuphap/khodldc/dldc_1/tailieu/tailieutkct/chucnangmanhinh.md';

let md = '# TÀI LIỆU RÀ SOÁT TÍNH NĂNG POPUP TRÊN TOÀN HỆ THỐNG\n\n';
md += 'Tài liệu này đánh giá hiện trạng các nút chức năng (Xem, Sửa, Xóa, Thêm, Duyệt...) trên toàn bộ các Modun của hệ thống (Collection, Category, Master Data, v.v...)\n\n';

md += '## Ghi chú Trạng thái\n';
md += '- ✅ **Có Popup (Hoàn chỉnh)**: Thao tác mở Modal/Popup thành công (VD: `setShowEditModal(true)`).\n';
md += '- ℹ️ **Điều hướng / API Ngầm**: Các hành động chuyển trang (`navigate`), gọi submit API, tắt modal, hoặc xử lý state local.\n';
md += '- ❌ **Lỗi/Chưa có Popup Thực sự**: Các nút bấm gọi thẳng `alert(...)` tạm thời, hoặc CHƯA ĐƯỢC GẮN Hàm OnClick (Dead button), cần phải thiết kế thêm giao diện Modal cho chúng.\n\n';

function walkDir(dir, fileList = []) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const file of files) {
    if (file.isDirectory() && file.name !== 'ui' && file.name !== 'icons') { 
      walkDir(path.join(dir, file.name), fileList);
    } else if (file.name.endsWith('.tsx') || file.name.endsWith('.jsx')) {
      if (file.name.includes('Page') || file.name.includes('Tab') || file.name.includes('List') || file.name.includes('Detail') || file.name.includes('Management') || file.name.includes('Combined') || file.name.includes('Form')) {
         fileList.push(path.join(dir, file.name));
      }
    }
  }
  return fileList;
}

const allFiles = walkDir(srcDir);
const modules = {};

allFiles.forEach(filePath => {
  const relPath = path.relative(srcDir, filePath);
  const parts = relPath.split(path.sep);
  // Example: pages/category/CategoryPage.tsx -> Module: pages/category
  // collection/DataCollectionList.tsx -> Module: collection
  let moduleName = parts[0];
  if (moduleName === 'pages' && parts.length > 1) {
    moduleName = parts[1];
  }
  
  if (!modules[moduleName]) modules[moduleName] = [];
  modules[moduleName].push(filePath);
});

for (const moduleName in modules) {
  md += `---\n\n# MODULE: ${moduleName.toUpperCase()}\n\n`;
  const moduleFiles = modules[moduleName];
  
  for (const filePath of moduleFiles) {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Tìm các button có onClick
    const btnRegex = /<button[^>]*onClick=\{([^\}]+)\}[^>]*>([\s\S]*?)<\/button>/g;
    // Tìm các ActionIconButton
    const actionIconRegex = /<ActionIconButton[^>]*onClick=\{([^\}]+)\}[^>]*icon=\{([^\}]+)\}[^>]*>/g;
    
    const buttons = [];
    let match;
    const seen = new Set();
    
    // Process native buttons
    while ((match = btnRegex.exec(content)) !== null) {
      const onClick = match[1];
      let innerText = match[2].replace(/<[^>]+>/g, '').trim().replace(/\s+/g, ' ');
      const titleMatch = match[0].match(/title=["']([^"']+)["']/);
      const title = titleMatch ? titleMatch[1] : '';
      let name = (innerText || title || 'Icon Button').substring(0, 50);
      name = name.replace(/\r?\n|\r/g, '').trim();
      
      const key = name + onClick;
      if (seen.has(key)) continue;
      seen.add(key);
      
      processAction(name, onClick, buttons);
    }
    
    // Process ActionIconButtons (mostly used in collection lists for View/Edit/Delete)
    while ((match = actionIconRegex.exec(content)) !== null) {
      const onClick = match[1];
      const iconText = match[2].trim(); // e.g. <Eye .../>
      let name = 'Icon Action';
      if (iconText.includes('Eye')) name = 'Xem (Eye)';
      if (iconText.includes('Edit')) name = 'Sửa (Edit)';
      if (iconText.includes('Trash')) name = 'Xóa (Trash)';
      if (iconText.includes('PowerOff')) name = 'Tắt (PowerOff)';
      
      const titleMatch = match[0].match(/title=["']([^"']+)["']/);
      if (titleMatch) name += ` - ${titleMatch[1]}`;
      
      const key = name + onClick;
      if (seen.has(key)) continue;
      seen.add(key);
      
      processAction(name, onClick, buttons);
    }
    
    // Find missing onClick buttons (dead buttons)
    const deadBtnRegex = /<button(?![^>]*onClick=)[^>]*>([\s\S]*?)<\/button>/g;
    while ((match = deadBtnRegex.exec(content)) !== null) {
      if (match[0].includes('type="submit"')) continue; // skip form submits
      let innerText = match[1].replace(/<[^>]+>/g, '').trim().replace(/\s+/g, ' ');
      const titleMatch = match[0].match(/title=["']([^"']+)["']/);
      const title = titleMatch ? titleMatch[1] : '';
      let name = (innerText || title || 'Icon Button').substring(0, 50).trim();
      if (!name) continue;
      
      const key = name + "NO_ACTION";
      if (seen.has(key)) continue;
      seen.add(key);
      
      buttons.push({ name, action: 'Khuyết thuộc tính onClick', status: '❌ KHÔNG CÓ ACTION' });
    }
    
    if (buttons.length > 0) {
      md += `### File: \`${path.relative(srcDir, filePath).replace(/\\/g, '/')}\`\n`;
      md += '| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |\n';
      md += '|---|---|---|\n';
      buttons.forEach(b => {
        md += `| **${b.name.replace(/\\r?\\n/g, '')}** | \`${b.action.replace(/\\|/g, '\\|')}\` | ${b.status} |\n`;
      });
      md += '\n';
    }
  }
}

function processAction(name, onClick, buttons) {
      let cleanAction = onClick.replace(/\r?\n|\r|\t/g, ' ').replace(/\s+/g, ' ').trim();
      let shortAction = cleanAction.substring(0, 60);
      if (cleanAction.length > 60) shortAction += '...';
      
      let status = 'ℹ️ Action Nội bộ / Điều hướng';
      if (cleanAction.includes('setShow') && cleanAction.includes('true')) status = '✅ Hiển thị Modal/Popup';
      else if (cleanAction.includes('Modal') || cleanAction.includes('Dialog')) status = '✅ Gọi Mở/Đóng Modal';
      else if (cleanAction.includes('setShow') && cleanAction.includes('false')) status = 'ℹ️ Đóng Modal';
      else if (cleanAction.toLowerCase().includes('alert(')) status = '❌ Chỉ Cảnh báo Alert (Cần Popup)';
      else if (cleanAction.includes('navigate') || cleanAction.includes('Link')) status = '🔗 Chuyển trang';
      
      if (name.includes('Icon Button') || name === '') {
        if (cleanAction.includes('Close') || cleanAction.includes('false') || cleanAction.includes('X')) name = 'Nút Đóng (Icon X)';
        else if (cleanAction.includes('Delete') || cleanAction.includes('Trash')) name = 'Nút Xóa (Icon Trash)';
        else if (cleanAction.includes('Edit')) name = 'Nút Sửa (Icon Edit)';
        else if (cleanAction.includes('Add') || cleanAction.includes('Plus')) name = 'Nút Thêm (Icon Plus)';
        else name = 'Nút điều khiển tự do (Icon)';
      }
      
      buttons.push({ name, action: shortAction, status });
}

fs.writeFileSync(outputFile, md, 'utf-8');
console.log('Done writing comprehensive audit markdown');
