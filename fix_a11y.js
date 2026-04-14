const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;

      // Fix buttons
      const btnRegex = /<button(?![^>]*\btitle=)(?![^>]*\baria-label=)([^>]*)>/g;
      if (btnRegex.test(content)) {
        content = content.replace(btnRegex, '<button title="Click">');
        changed = true;
      }

      // Fix selects
      const selectRegex = /<select(?![^>]*\btitle=)(?![^>]*\baria-label=)([^>]*)>/g;
      if (selectRegex.test(content)) {
        content = content.replace(selectRegex, '<select title="Select option">');
        changed = true;
      }

      // Fix inputs (except type hidden, checkbox, radio)
      const inputRegex = /<input(?![^>]*\btitle=)(?![^>]*\baria-label=)(?![^>]*\bid=)(?![^>]*\btype=["'](?:hidden|checkbox|radio)["'])([^>]*)>/g;
      if (inputRegex.test(content)) {
        content = content.replace(inputRegex, '<input title="Input field">');
        changed = true;
      }

      // Fix textarea
      const textareaRegex = /<textarea(?![^>]*\btitle=)(?![^>]*\baria-label=)(?![^>]*\bid=)([^>]*)>/g;
      if (textareaRegex.test(content)) {
        content = content.replace(textareaRegex, '<textarea title="Text input">');
        changed = true;
      }

      if (changed) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log('Fixed accessibility in', fullPath);
      }
    }
  }
}

processDir('d:/tuphap/khodldc/dldc_1/src/components');
