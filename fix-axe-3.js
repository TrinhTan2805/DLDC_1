const fs = require('fs');

const files = [
  'src/components/pages/category/CategoryPage.tsx',
  'src/components/pages/category/CategoryStatisticsReportPage.tsx',
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  
  let i = 0;
  while ((i = content.indexOf('<button', i)) !== -1) {
    let endTag = content.indexOf('</button>', i);
    if (endTag === -1) { i++; continue; }
    
    let buttonSnippet = content.substring(i, endTag + 9);
    
    // Check if it already has title or aria-label
    if (buttonSnippet.includes('title=') || buttonSnippet.includes('aria-label=')) {
      i = endTag + 9;
      continue;
    }

    // Identify the end of the opening tag.
    let closeBracket = i;
    while (closeBracket < endTag) {
      closeBracket = content.indexOf('>', closeBracket);
      if (closeBracket === -1) break;
      // if previous char is =, it could be an arrow fn: =>
      if (content[closeBracket - 1] === '=') {
        closeBracket++;
        continue;
      }
      break;
    }
    
    if (closeBracket === -1) {
      i++; continue;
    }

    let innerHtml = content.substring(closeBracket + 1, endTag);
    let stripped = innerHtml.replace(/<[^>]+>/g, '').trim();
    let hasText = /[a-zA-ZàáãạảăắằẳẵặâấầẩẫậèéẹẻẽêềếểễệđìíĩỉịòóõọỏôốồổỗộơớờởỡợùúũụủưứừửữựỳỵỷỹýÀÁÃẠẢĂẮẰẲẴẶÂẤẦẨẪẬÈÉẸẺẼÊỀẾỂỄỆĐÌÍĨỈỊÒÓÕỌỎÔỐỒỔỖỘƠỚỜỞỠỢÙÚŨỤỦƯỨỪỬỮỰỲỴỶỸÝ]/i.test(stripped);

    if (!hasText) {
      let title = "Hành động";
      if (innerHtml.includes('<X ')) title = "Đóng";
      else if (innerHtml.includes('<Trash')) title = "Xóa";
      else if (innerHtml.includes('<Pencil')) title = "Chỉnh sửa";
      else if (innerHtml.includes('<Eye')) title = "Xem chi tiết";
      else if (innerHtml.includes('<Plus')) title = "Thêm mới";
      else if (innerHtml.includes('<Filter')) title = "Trích lọc";
      else if (innerHtml.includes('<Download')) title = "Tải xuống";
      else if (innerHtml.includes('<Upload')) title = "Tải lên";
      else if (innerHtml.includes('<Refresh')) title = "Làm mới";
      else if (innerHtml.includes('<Search')) title = "Tìm kiếm";
      else if (innerHtml.includes('<FileDown')) title = "Xuất tệp";

      let newButton = content.substring(i, closeBracket).replace('<button', `<button title="${title}" aria-label="${title}"`) + content.substring(closeBracket, endTag + 9);
      content = content.substring(0, i) + newButton + content.substring(endTag + 9);
      i += newButton.length;
    } else {
      i = endTag + 9;
    }
  }

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated buttons in ${file}`);
  }
});
