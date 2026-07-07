#!/usr/bin/env node
// CI check: plugin structure is intact. Zero dependencies.
// - every .json in the repo parses
// - .claude-plugin/plugin.json exists and has a name
// - commands/*.md exist (the slash commands the plugin ships)

import { readFileSync, readdirSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, relative } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
let failed = false;
const fail = (msg) => { console.error(`FAIL: ${msg}`); failed = true; };

// 1. All JSON files parse
function* walk(dir) {
  for (const name of readdirSync(dir)) {
    if (name === ".git" || name === "node_modules") continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* walk(p);
    else yield p;
  }
}
for (const p of walk(root)) {
  if (!p.endsWith(".json")) continue;
  const rel = relative(root, p);
  try {
    JSON.parse(readFileSync(p, "utf8"));
    console.log(`ok: json ${rel}`);
  } catch (e) {
    fail(`${rel} — ${e.message}`);
  }
}

// 2. Plugin manifest has a name
try {
  const manifest = JSON.parse(readFileSync(join(root, ".claude-plugin", "plugin.json"), "utf8"));
  if (!manifest.name) fail(".claude-plugin/plugin.json has no name");
  else console.log(`ok: plugin manifest name=${manifest.name}`);
} catch (e) {
  fail(`.claude-plugin/plugin.json — ${e.message}`);
}

// 3. Slash commands present
const REQUIRED_COMMANDS = ["claude-md-new.md", "claude-md-audit.md"];
for (const cmd of REQUIRED_COMMANDS) {
  try {
    if (readFileSync(join(root, "commands", cmd), "utf8").trim().length === 0) fail(`commands/${cmd} is empty`);
    else console.log(`ok: commands/${cmd}`);
  } catch {
    fail(`commands/${cmd} missing`);
  }
}

if (failed) process.exit(1);
console.log("PASS: check");
