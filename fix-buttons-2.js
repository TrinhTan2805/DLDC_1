const fs = require('fs');

const files = [
  'src/components/pages/category/CategoryPage.tsx',
  'src/components/pages/category/CategoryReportPage.tsx',
  'src/components/pages/category/CategoryStatisticsReportPage.tsx',
  'src/components/pages/provision/InternalCatalogProvisionPage.tsx'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Find all <button ... > \s* <Icon ... /> \s* </button>
  // using [\s\S] instead of .* to match newlines
  const regex = /(<button)([\s\S]*?>)([\s\n]*<([A-Z][a-zA-Z0-9]*)[^>]*>[\s\n]*<\/button>)/g;

  content = content.replace(regex, (match, p1, p2, p3, iconName) => {
    // p1 = "<button"
    // p2 = " className='...' onClick={() => ...}>"
    // p3 = "\n  <X className='...' />\n</button>"
    // iconName = "X"
    
    // Check if title or aria-label already exists in p2
    if (p2.includes('title=') || p2.includes('aria-label=')) {
      return match;
    }

    let title = "Hành động";
    if (iconName === 'X') title = "Đóng";
    if (iconName === 'Eye') title = "Xem chi tiết";
    if (iconName.startsWith('Pencil')) title = "Chỉnh sửa";
    if (iconName.startsWith('Trash')) title = "Xóa";
    if (iconName === 'Download') title = "Tải xuống";
    if (iconName === 'Filter') title = "Lọc";
    if (iconName === 'Upload') title = "Tải lên";
    if (iconName === 'RefreshCw') title = "Làm mới";
    if (iconName === 'SlidersHorizontal') title = "Cài đặt nâng cao";
    if (iconName === 'Search') title = "Tìm kiếm";
    if (iconName === 'ChevronLeft') title = "Quay lại";
    if (iconName === 'ChevronRight') title = "Tiếp theo";
    if (iconName === 'Check') title = "Xác nhận";
    if (iconName === 'FileDown') title = "Xuất file";

    // Insert title and aria-label right after <button
    return p1 + ` title="${title}" aria-label="${title}"` + p2 + p3;
  });

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated buttons in ${file}`);
  }
});
