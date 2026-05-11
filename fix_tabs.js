const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src', 'components');
const files = fs.readdirSync(dir).filter(f => f.endsWith('Modal.tsx'));

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // 1. Remove detailTab state
  content = content.replace(/\s*const\s+\[detailTab,\s*setDetailTab\]\s*=\s*useState\([^)]+\);/g, '');

  // 2. Remove the Tabs UI entirely
  // Search for `{\/\* Tabs \*\/}` and remove the div that follows it up to `{\/\* Content \*\/}`
  content = content.replace(/\{\/\*\s*Tabs\s*\*\/\}\s*<div[\s\S]*?(?=\{\/\*\s*Content\s*\*\/\})/g, '');
  
  // For DataDetailModal which has different comments or formatting, let's also remove:
  content = content.replace(/<div className="px-6 pt-4 flex-shrink-0 border-b border-slate-200">[\s\S]*?<\/div>\s*<\/div>\s*(?=\{\/\*\s*Content\s*\*\/\})/g, '');

  // 3. Remove conditional rendering for detailTab and its closing bracket.
  // Instead of replacing `{detailTab === '...' && (` with `<div>`, we will remove `{detailTab === '...' && (`
  // AND we will remove the matching `)}`
  
  // A simple way is to match `{detailTab === '...' && (` and remove it.
  // Then we have unbalanced `)}`.
  // Wait! If we remove `{detailTab === '...' && (` AND we remove `)}`, the inner content will just be placed inside the parent div.
  // We can do this with a stack or by splitting by lines.

  let lines = content.split('\n');
  let newLines = [];
  let detailTabIndentations = [];

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    // Check if line starts a detailTab condition
    let match = line.match(/^(\s*)\{detailTab\s*===\s*'[^']+'\s*&&\s*\(\s*$/);
    if (match) {
      // Store the indentation of this `)` to find the closing `)}`
      detailTabIndentations.push(match[1]);
      // We also want to wrap the sections in `<div className="space-y-4 mb-8">` to separate them vertically.
      // But let's just skip the line and let the inner divs render.
      newLines.push(match[1] + '<div className="mb-8">');
      continue;
    }
    
    // Check if line is `)}`
    let closeMatch = line.match(/^(\s*)\)\}\s*$/);
    if (closeMatch && detailTabIndentations.length > 0) {
      // Is this closing the last detailTab?
      let lastIndent = detailTabIndentations[detailTabIndentations.length - 1];
      if (closeMatch[1] === lastIndent) {
        // It's a match! Replace with `</div>`
        newLines.push(lastIndent + '</div>');
        detailTabIndentations.pop();
        continue;
      }
    }

    // 4. Remove "Xuất file" button
    // It's usually inside `<button ...> \n <FileDown ... /> \n Xuất file \n </button>`
    // We can filter out these lines if we find them. But wait, it spans multiple lines.
    
    newLines.push(line);
  }

  content = newLines.join('\n');
  
  // Clean up "Xuất file" button using regex
  content = content.replace(/<button[^>]*>\s*<FileDown[^>]*\/>\s*Xuất file\s*<\/button>/g, '');
  // sometimes it's `<FileDown className="w-4 h-4" />\n Xuất file`
  content = content.replace(/<button[^>]*>[\s\S]*?<FileDown[\s\S]*?Xuất file[\s\S]*?<\/button>/g, '');

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Fixed', file);
  }
});
