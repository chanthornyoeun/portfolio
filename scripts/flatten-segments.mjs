// shortcut: Next 16.4 static export writes segment prefetch files as nested folders
// (resume/__next.resume/__PAGE__.txt) while the client requests a flat dotted name
// (resume/__next.resume.__PAGE__.txt). Static hosts like GitHub Pages then return 404
// for every prefetch. This copies each nested file to the flat name the client asks for.
// Remove this script once Next.js exports the flat names itself (check after upgrading).
import { copyFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";

const root = resolve("out");
if (!existsSync(root)) {
  console.error("out/ not found. Run `next build` first.");
  process.exit(1);
}

let copied = 0;

// Copy every file under a "__next.*" folder to "<parent>/<folder>.<sub>.<path>".
function flatten(segmentDir, parent, prefix) {
  for (const name of readdirSync(segmentDir)) {
    const p = join(segmentDir, name);
    const flatName = `${prefix}.${name}`;
    if (statSync(p).isDirectory()) flatten(p, parent, flatName);
    else {
      copyFileSync(p, join(parent, flatName));
      copied++;
    }
  }
}

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (!statSync(p).isDirectory()) continue;
    if (name.startsWith("__next.")) flatten(p, dir, name);
    else walk(p);
  }
}

walk(root);
console.log(`Flattened ${copied} segment prefetch files.`);
