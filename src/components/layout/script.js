const fs = require('fs');
let content = fs.readFileSync('f:\\BTP\\DLDC_1\\src\\components\\layout\\Sidebar.tsx', 'utf-8');

// Extract the menuItems array literal
let start = content.indexOf('const menuItems: MenuItem[] = [');
let end = content.indexOf('];', start);
let arrayStr = content.substring(start + 'const menuItems: MenuItem[] = '.length, end + 1);

arrayStr = arrayStr.replace(/icon:\s*[A-Za-z0-9_]+,?\s*/g, '');
arrayStr = arrayStr.replace(/color:\s*['\"].*?['\"],?\s*/g, '');
arrayStr = arrayStr.replace(/isGroup:\s*true,?\s*/g, '');

const reconciliationData = [];
const GitCompare = null; // Just in case it's still there

let items = eval('(' + arrayStr + ')');

function convert(items) {
  return items.map(item => {
    let res = { id: item.id, name: item.label };
    if (item.subItems && item.subItems.length > 0) {
      res.children = convert(item.subItems);
    } else {
      res.functions = [
        { id: item.id + '-func', name: item.label, actions: ['Xem', 'Thêm', 'Sửa', 'Xóa', 'Xuất Excel'] }
      ];
    }
    return res;
  });
}

const structure = convert(items);
fs.writeFileSync('f:\\BTP\\DLDC_1\\src\\components\\layout\\extracted_menu.json', JSON.stringify(structure, null, 2));
console.log('Done!');
