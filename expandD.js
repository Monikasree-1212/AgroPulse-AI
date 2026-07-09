const fs = require('fs'); 
const file = './backend/data/sampleData.js'; 
let content = fs.readFileSync(file, 'utf8'); 

const mandiMatch = content.match(/const mandis = \[([\s\S]*?)\]\n/); 
if(mandiMatch) { 
  const singleMandis = eval('([' + mandiMatch[1] + '])'); 
  const allMandis = []; 
  const crops = { 
    'Onion': {base: 25, var: 15}, 
    'Potato': {base: 15, var: 10}, 
    'Tomato': {base: 30, var: 20}, 
    'Pulses': {base: 80, var: 30}, 
    'Maize': {base: 20, var: 8}, 
    'Coconut': {base: 30, var: 10} 
  }; 
  
  singleMandis.forEach(m => { 
    for (const [c, rules] of Object.entries(crops)) { 
      // Vary prices strictly bounded to rules, generate realistic distance jitter
      allMandis.push({ 
        ...m, 
        _id: Math.random().toString(36).substr(2, 9),
        commodity: c, 
        price: rules.base + Math.floor(Math.random()*rules.var) 
      }); 
    } 
  }); 
  
  const newMandiStr = 'const mandis = ' + JSON.stringify(allMandis, null, 2) + '\n'; 
  content = content.replace(/const mandis = \[[\s\S]*?\]\n/, newMandiStr); 
  fs.writeFileSync(file, content); 
  console.log('Generated 240 crop-specific mandis!'); 
}
