const fs = require('fs');

const mappings = [
  { old: /https?:\/\/agricoop\.nic\.in\/?/g, new: "https://agriwelfare.gov.in/" },
  { old: /https?:\/\/pmkisan\.gov\.in\/?/g, new: "https://pmkisan.gov.in/" },
  { old: /https?:\/\/enam\.gov\.in\/?/g, new: "https://enam.gov.in/" },
  { old: /https?:\/\/agmarknet\.gov\.in\/?/g, new: "https://agmarknet.gov.in/" },
  { old: /https?:\/\/pmfby\.gov\.in\/?/g, new: "https://pmfby.gov.in/" },
  { old: /https?:\/\/soilhealth\.dac\.gov\.in\/?/g, new: "https://soilhealth.dac.gov.in/" },
];

const files = ['./backend/data/sampleData.js', './generate_schemes.js'];

files.forEach(f => {
  try {
    let content = fs.readFileSync(f, 'utf8');
    mappings.forEach(m => {
      content = content.replace(m.old, m.new);
    });
    fs.writeFileSync(f, content);
    console.log(`Updated URLs in ${f}`);
  } catch (err) {
    console.error(`Error updating ${f}:`, err.message);
  }
});
