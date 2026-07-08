const fs = require("fs");
const path = require("path");

const extensions = [
  ".js",
  ".jsx",
  ".ts",
  ".tsx",
  ".json",
  ".css",
  ".html",
  ".md"
];

const ignoreFolders = [
  "node_modules",
  ".git",
  "dist",
  "build",
  ".next",
  "coverage"
];

const replacements = {
  "Rs.": "Rs.",
  "->": "->",
  "<-": "<-",
  "Up": "Up",
  "Down": "Down",
  "Yes": "Yes",
  "No": "No",
  "Warning": "Warning"
};

function fixText(text) {
  let output = text;

  for (const [bad, good] of Object.entries(replacements)) {
    output = output.split(bad).join(good);
  }

  output = output.replace(/[\u0080-\uFFFF]/g, "");

  return output;
}

function walk(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    if (ignoreFolders.includes(file)) continue;

    const full = path.join(dir, file);

    if (fs.statSync(full).isDirectory()) {
      walk(full);
      continue;
    }

    if (!extensions.includes(path.extname(full))) continue;

    const original = fs.readFileSync(full, "utf8");
    const fixed = fixText(original);

    if (original !== fixed) {
      fs.writeFileSync(full, fixed, "utf8");
      console.log("Fixed:", full);
    }
  }
}

walk(process.cwd());

console.log("Encoding repair completed.");
