const fs = require('fs');
const f = './data/sampleData.js';
let c = fs.readFileSync(f, 'utf8');

// The file format looks like:
// "longitude": 80.2131,
// "_id": "0y9pbe0o4"
// }

// Replace the line with _id and the comma before it
c = c.replace(/,\s*"_id":\s*"[^"]+"/g, '');

fs.writeFileSync(f, c);
console.log('Fixed sampleData.js');
