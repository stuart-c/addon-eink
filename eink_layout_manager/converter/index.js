#!/usr/bin/env node

function main() {
  console.log("hello world");
}

if (import.meta.url === `file://${process.argv[1]}` || process.argv[1] === "." || process.argv[1]?.endsWith("index.js")) {
  main();
}

export { main };
