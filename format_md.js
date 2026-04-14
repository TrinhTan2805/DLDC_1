const fs = require('fs');
const data = JSON.parse(fs.readFileSync('button_audit.json', 'utf8'));

let md = '# Đánh giá chức năng Popup của các nút bấm (Button Audit)\n\n';
md += 'Dưới đây là danh sách phân tích các nút bấm trên các màn hình chính. Các nút đã được kiểm tra xem có gọi Popup (thông qua `setShow...Modal(true)` hoặc tương tự) hay chưa.\n\n';

for (const module of data) {
  md += `## Màn hình: ${module.file} (module: ${module.module})\n\n`;
  md += '| Tên nút / Chức năng | Hành động (Action) | Trạng thái Popup |\n';
  md += '|---|---|---|\n';
  
  const seen = new Set();
  
  for (const btn of module.buttons) {
    const key = btn.name + btn.action;
    if (seen.has(key)) continue;
    seen.add(key);
    
    let cleanName = btn.name.replace(/\r?\n|\r/g, '').trim();
    if (cleanName.includes('Icon Button') || cleanName === '') {
      if (btn.action.includes('Close') || btn.action.includes('false')) cleanName = 'Nút Đóng (Icon X)';
      else if (btn.action.includes('Delete') || btn.action.includes('Trash')) cleanName = 'Nút Xóa (Icon Trash)';
      else if (btn.action.includes('Edit')) cleanName = 'Nút Sửa (Icon Edit)';
      else if (btn.action.includes('Add')) cleanName = 'Nút Thêm (Icon Plus)';
      else cleanName = 'Nút điều khiển tự do (Icon)';
    }
    
    let cleanAction = btn.action.replace(/\r?\n|\r|\t/g, ' ').replace(/\s+/g, ' ').substring(0, 50);
    if (btn.action.length > 50) cleanAction += '...';
    
    let status = '❌ Chưa có Popup / Trực tiếp';
    if (btn.hasPopup && cleanAction.includes('true')) status = '✅ Dùng trạng thái React Modal';
    else if (btn.hasPopup && cleanAction.includes('false')) status = 'ℹ️ Dùng để đóng Modal';
    else if (cleanAction.includes('Modal') || cleanAction.includes('Dialog')) status = 'ℹ️ Đóng/Mở Modal';
    else if (cleanAction.includes('navigate') || cleanAction.toLowerCase().includes('href')) status = '🔗 Chuyển trang (Link)';
    
    md += `| **${cleanName}** | \`${cleanAction}\` | ${status} |\n`;
  }
  md += '\n';
}

fs.writeFileSync('button_audit.md', md, 'utf8');
