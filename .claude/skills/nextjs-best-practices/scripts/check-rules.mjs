#!/usr/bin/env node
// Checks: max 250 lines per file, and at most one top-level function/component per file.
// Usage: node check-rules.mjs [dir ...]   (default: src)

import { readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join } from "node:path";

const MAX_LINES = 250;
const EXTENSIONS = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs"]);
const SKIP_DIRS = new Set(["node_modules", ".next", ".git", "dist", "build"]);
// Next.js files that may legitimately export several things (HTTP verbs, config).
const MULTI_OK = /(^|[\\/])route\.(ts|js)$/;

// Top-level declarations only (no leading indentation).
const FUNCTION_PATTERNS = [
  /^(?:export\s+)?(?:default\s+)?(?:async\s+)?function\s*\*?\s*\w*/,
  /^(?:export\s+)?const\s+\w+\s*(?::[^=]+)?=\s*(?:async\s*)?(?:\([^)]*\)|\w+)\s*(?::[^=]+)?=>/,
  /^(?:export\s+)?const\s+\w+\s*=\s*(?:async\s*)?function/,
  /^(?:export\s+)?const\s+\w+\s*=\s*(?:cache|memo|forwardRef)\s*\(/,
];

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (SKIP_DIRS.has(name)) continue;
    const full = join(dir, name);
    const stat = statSync(full);
    if (stat.isDirectory()) walk(full, out);
    else if (EXTENSIONS.has(extname(name))) out.push(full);
  }
  return out;
}

function countTopLevelFunctions(lines) {
  let count = 0;
  for (const line of lines) {
    if (FUNCTION_PATTERNS.some((re) => re.test(line))) count += 1;
  }
  return count;
}

const roots = process.argv.slice(2);
if (roots.length === 0) roots.push("src");

const violations = [];
for (const root of roots) {
  let files;
  try {
    files = walk(root);
  } catch {
    console.error(`Cannot read directory: ${root}`);
    process.exit(2);
  }
  for (const file of files) {
    const lines = readFileSync(file, "utf8").split(/\r?\n/);
    if (lines.length > MAX_LINES) {
      violations.push(`${file}: ${lines.length} lines (max ${MAX_LINES})`);
    }
    if (MULTI_OK.test(file)) continue;
    const fnCount = countTopLevelFunctions(lines);
    if (fnCount > 1) {
      violations.push(`${file}: ${fnCount} top-level functions (max 1). Split into separate files.`);
    }
  }
}

if (violations.length > 0) {
  console.error(`\nFound ${violations.length} violation(s):\n`);
  for (const v of violations) console.error(`  - ${v}`);
  process.exit(1);
}
console.log("All files pass: <= 250 lines and one function per file.");
