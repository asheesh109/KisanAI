const fs = require('fs');
const path = require('path');
function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) results = results.concat(walk(file));
    else if (file.endsWith('.test.jsx') || file.endsWith('.test.js')) results.push(file);
  });
  return results;
}
const files = walk('src/__tests__');
const strings = new Set();
files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  let match;
  const stringRegex = /(['\\"])([^'\\"]*[\u0900-\u097F]+[^'\\"]*)\1/g;
  while ((match = stringRegex.exec(content)) !== null) {
    strings.add(match[2]);
  }
  const regexLiteral = /\/([^/]*[\u0900-\u097F]+[^/]*)\//g;
  while ((match = regexLiteral.exec(content)) !== null) {
    strings.add(match[1]);
  }
});
console.log(Array.from(strings).join('\n'));
