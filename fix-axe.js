const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('src');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // We find <button ... > ... </button>
  // We use regex to match the button opening tag, its contents, and the closing tag
  const regex = /(<button[^>]*>)([\s\S]*?)<\/button>/g;

  content = content.replace(regex, (match, openTag, innerHtml) => {
    // If opening tag already has accessibility info, skip
    if (openTag.includes('title=') || openTag.includes('aria-label=')) {
      return match;
    }

    // Check if innerHtml contains discernible text
    // Ignore html tags and comments, just look for letters in Vietnamese alphabet
    const stripped = innerHtml.replace(/<[^>]+>/g, '').trim();
    const hasText = /[a-zA-ZàáãạảăắằẳẵặâấầẩẫậèéẹẻẽêềếểễệđìíĩỉịòóõọỏôốồổỗộơớờởỡợùúũụủưứừửữựỳỵỷỹýÀÁÃẠẢĂẮẰẲẴẶÂẤẦẨẪẬÈÉẸẺẼÊỀẾỂỄỆĐÌÍĨỈỊÒÓÕỌỎÔỐỒỔỖỘƠỚỜỞỠỢÙÚŨỤỦƯỨỪỬỮỰỲỴỶỸÝ]/i.test(stripped);

    if (!hasText) {
      // It's an icon only button without title! Let's guess the title based on the icon inside
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

      const newOpenTag = openTag.replace('<button', `<button title="${title}" aria-label="${title}"`);
      return newOpenTag + innerHtml + '</button>';
    }

    return match;
  });

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated headless buttons in ${file}`);
  }
});
