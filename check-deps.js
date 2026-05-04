const fs = require("fs");
const path = require("path");

const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
const deps = Object.keys(packageJson.dependencies || {});

const searchDirs = ["App.js", "index.js", "src"];
const files = [];

function walk(target) {
  if (!fs.existsSync(target)) return;

  const stat = fs.statSync(target);

  if (stat.isFile()) {
    if (/\.(js|jsx|ts|tsx)$/.test(target)) {
      files.push(target);
    }
    return;
  }

  for (const item of fs.readdirSync(target)) {
    walk(path.join(target, item));
  }
}

for (const dir of searchDirs) {
  walk(dir);
}

const allCode = files
  .map((file) => fs.readFileSync(file, "utf8"))
  .join("\n");

console.log("\nDependency usage scan:\n");

for (const dep of deps) {
  const escaped = dep.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const patterns = [
    new RegExp(`from\\s+['"]${escaped}['"]`),
    new RegExp(`require\\(['"]${escaped}['"]\\)`),
    new RegExp(`import\\s+['"]${escaped}['"]`)
  ];

  const used = patterns.some((pattern) => pattern.test(allCode));

  console.log(`${used ? "USED    " : "NOT FOUND"}  ${dep}`);
}