const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'frontend', 'src');

const mappings = {
  'AI': '🤖',
  'Weather': '🌦️',
  'Market': '🏪',
  'Profit': '💰',
  'Calculator': '💰', // For profit simulator fallback
  'Voice': '🎤',
  'Bell': '🔔',
  'Target': '🎯',
  'Trend': '📈',
  'Price': '💲',
  'Predict': '🔮',
  'Government': '🏛️'
};

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;

      // Replace icon: '...'
      for (const [key, emoji] of Object.entries(mappings)) {
        const regex1 = new RegExp(`icon:\\s*'${key}'`, 'g');
        if (regex1.test(content)) {
          content = content.replace(regex1, `icon: '${emoji}'`);
          changed = true;
        }
        const regex2 = new RegExp(`icon:\\s*"${key}"`, 'g');
        if (regex2.test(content)) {
          content = content.replace(regex2, `icon: "${emoji}"`);
          changed = true;
        }
      }

      // Replace exact match >Text< (for hardcoded elements)
      for (const [key, emoji] of Object.entries(mappings)) {
        // e.g. <span className="text-2xl">AI</span>
        const regex3 = new RegExp(`>\\s*${key}\\s*<`, 'g');
        if (regex3.test(content)) {
          // ensure we only replace the ones that are actual placeholders and not normal text
          // to be safe, only replace if it's very short and exact
          content = content.replace(regex3, `>${emoji}<`);
          changed = true;
        }
      }

      if (changed) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

processDirectory(srcDir);
console.log('Icon replacement completed.');
