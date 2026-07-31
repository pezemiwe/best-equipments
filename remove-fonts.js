const fs = require('fs');
const path = require('path');

const walk = (dir, callback) => {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(dirPath);
  });
};

walk('./src', (filePath) => {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    if (content.includes('@next/font/google')) {
      content = content.replace(/import\s+\{.*\}\s+from\s+['"]@next\/font\/google['"];?/g, '');
      content = content.replace(/const\s+\w+\s*=\s*\w+\(\{[\s\S]*?\}\);/g, '');
      content = content.replace(/oswald\.className/g, '"font-oswald"');
      content = content.replace(/montserrat\.className/g, '"font-montserrat"');
      content = content.replace(/roboto\.className/g, '"font-roboto"');
      fs.writeFileSync(filePath, content);
      console.log(`Updated ${filePath}`);
    }
  }
});
