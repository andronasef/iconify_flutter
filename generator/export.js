// list all files in a directory in Node.js recursively in a synchronous fashion

import fs from 'fs';
import path from 'path';

// list files in directory
function listFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    fileList.push(path.join(file));
  });

  return fileList;
}
fs.writeFileSync('lib/icons.dart', '');
for (const file of listFiles('lib/icons')) {
  fs.appendFileSync('lib/icons.dart', `export 'icons/${file}';\n`);
}
