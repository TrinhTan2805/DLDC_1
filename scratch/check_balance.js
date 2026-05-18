
import fs from 'fs';

const content = fs.readFileSync('f:/BTP/DLDC_1/src/components/collection/APIMethodsList.tsx', 'utf8');

let divOpen = 0;
let divClose = 0;
let braceOpen = 0;
let braceClose = 0;
let parenOpen = 0;
let parenClose = 0;

const divs = content.match(/<div/g) || [];
const closedDivs = content.match(/<\/div>/g) || [];

console.log('Divs opened:', divs.length);
console.log('Divs closed:', closedDivs.length);

const braces = content.match(/{/g) || [];
const closedBraces = content.match(/}/g) || [];

console.log('Braces opened:', braces.length);
console.log('Braces closed:', closedBraces.length);

const parens = content.match(/\(/g) || [];
const closedParens = content.match(/\)/g) || [];

console.log('Parens opened:', parens.length);
console.log('Parens closed:', closedParens.length);
