#!/usr/bin/env node
// Local content editor for the portfolio. Run with `npm run post`.
//
// Content lives in content/*.json and uploaded images in public/uploads/.
// Both are committed to git, so publishing = commit + push, and Netlify rebuilds.
// No dependencies: Node built-ins only.

import { execFileSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  statSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import readline from "node:readline";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CONTENT_DIR = path.join(ROOT, "content");
const UPLOAD_DIR = path.join(ROOT, "public", "uploads");
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const IMAGE_TYPES = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
};
const IMAGE_EXTS = new Set(Object.values(IMAGE_TYPES).concat("jpeg"));

// ---------------------------------------------------------------- collections

// Each field: key, label, and optional flags.
//   required: re-ask until non-empty (on add)
//   list:     comma-separated input stored as an array
//   image:    local path or https URL, copied into public/uploads/<upload>/
//   url:      must be http(s) (or "#..." / "/..." for on-site links)
const collections = {
  projects: {
    title: "Projects",
    upload: "projects",
    summary: (i) => `${i.title}  [${(i.stack || []).join(", ")}]`,
    fields: [
      { key: "title", label: "Title", required: true },
      { key: "description", label: "Description", required: true },
      { key: "stack", label: "Stack (comma separated)", list: true },
      { key: "href", label: "Link (https://... or #projects)", url: true, fallback: "#projects" },
    ],
  },
  blogCards: {
    title: "Blogs",
    upload: "blogs",
    summary: (i) => `${i.title}  ${i.href}`,
    fields: [
      { key: "href", label: "Blogspot URL", url: true, required: true },
      { key: "title", label: "Title", required: true },
      { key: "image", label: "Cover image (path or https URL)", image: true },
    ],
  },
  events: {
    title: "Events",
    upload: "events",
    summary: (i) => `${i.date}  ${i.title}`,
    fields: [
      { key: "title", label: "Title", required: true },
      { key: "date", label: "Date / year (e.g. 2025)", required: true },
      { key: "description", label: "Description", required: true },
      { key: "image", label: "Image (path or https URL)", image: true },
    ],
  },
  certificates: {
    title: "Certificates",
    upload: "certificates",
    summary: (i) => `${i.date}  ${i.title}  (${i.issuer})`,
    fields: [
      { key: "title", label: "Title", required: true },
      { key: "issuer", label: "Issuer", required: true },
      { key: "date", label: "Date (e.g. Jan 2026)" },
      { key: "description", label: "Description" },
      { key: "certificateUrl", label: "Certificate image (path or https URL)", image: true },
    ],
  },
  skills: {
    title: "Skills (chips in About)",
    upload: null,
    summary: (i) => `${i.name}  (${i.category})`,
    fields: [
      { key: "name", label: "Name", required: true },
      { key: "category", label: "Category" },
    ],
  },
};

// ------------------------------------------------------------------- prompting

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: Boolean(process.stdin.isTTY),
});
const lineQueue = [];
let lineWaiter = null;
let inputClosed = false;

rl.on("line", (line) => {
  if (lineWaiter) {
    const resolve = lineWaiter;
    lineWaiter = null;
    resolve(line);
  } else {
    lineQueue.push(line);
  }
});
rl.on("close", () => {
  inputClosed = true;
  if (lineWaiter) lineWaiter(null);
});

class InputEnded extends Error {}

// Queue-based so it also works when stdin is piped (readline's question() drops
// lines that arrive before the question is asked).
async function ask(question) {
  if (!lineQueue.length && inputClosed) throw new InputEnded();
  if (inputClosed) {
    process.stdout.write(question);
  } else {
    rl.setPrompt(question);
    rl.prompt();
  }
  let line;
  if (lineQueue.length) line = lineQueue.shift();
  else line = await new Promise((resolve) => (lineWaiter = resolve));
  if (line === null) throw new InputEnded();
  return line.trim();
}

async function confirm(question, defaultYes = true) {
  const answer = (await ask(`${question} ${defaultYes ? "[Y/n]" : "[y/N]"} `)).toLowerCase();
  if (!answer) return defaultYes;
  return answer === "y" || answer === "yes";
}

async function choose(title, options) {
  console.log(`\n${title}`);
  options.forEach((option, index) => console.log(`  ${index + 1}. ${option}`));
  for (;;) {
    const raw = await ask("> ");
    const n = Number.parseInt(raw, 10);
    if (n >= 1 && n <= options.length) return n - 1;
    console.log(`Enter a number from 1 to ${options.length}.`);
  }
}

async function pickItem(items, verb) {
  const raw = await ask(`Which number to ${verb}? (blank to cancel) `);
  if (!raw) return -1;
  const n = Number.parseInt(raw, 10);
  if (n >= 1 && n <= items.length) return n - 1;
  console.log("Not a valid number.");
  return -1;
}

// ------------------------------------------------------------------------ data

function readCollection(name) {
  const file = path.join(CONTENT_DIR, `${name}.json`);
  if (!existsSync(file)) return [];
  return JSON.parse(readFileSync(file, "utf8"));
}

function writeCollection(name, items) {
  mkdirSync(CONTENT_DIR, { recursive: true });
  writeFileSync(
    path.join(CONTENT_DIR, `${name}.json`),
    `${JSON.stringify(items, null, 2)}\n`,
  );
}

function slugify(text) {
  return (
    String(text)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) || "image"
  );
}

function isUploaded(value) {
  return typeof value === "string" && value.startsWith("/uploads/");
}

function allImageRefs() {
  const refs = new Set();
  for (const [name, def] of Object.entries(collections)) {
    for (const field of def.fields.filter((f) => f.image)) {
      for (const item of readCollection(name)) {
        if (item[field.key]) refs.add(item[field.key]);
      }
    }
  }
  return refs;
}

function deleteUploadIfUnused(value) {
  if (!isUploaded(value) || allImageRefs().has(value)) return;
  const file = path.join(ROOT, "public", value);
  if (file.startsWith(UPLOAD_DIR) && existsSync(file)) unlinkSync(file);
}

// ---------------------------------------------------------------------- images

function stripQuotes(value) {
  return value.replace(/^["']+|["']+$/g, "").trim();
}

// Copies a local file or downloads an https URL into public/uploads/<folder>/.
// Returns the site-relative path (e.g. /uploads/events/hackathon-ab12cd34.jpg).
async function storeImage(source, folder, label) {
  const input = stripQuotes(source);
  let bytes;
  let ext;

  if (/^https?:\/\//i.test(input)) {
    const response = await fetch(input, { headers: { "User-Agent": "Mozilla/5.0 portfolio-cli" } });
    if (!response.ok) throw new Error(`Download failed (HTTP ${response.status}).`);
    const type = (response.headers.get("content-type") || "").split(";")[0].trim();
    ext = IMAGE_TYPES[type];
    if (!ext) throw new Error(`That URL is not a supported image (${type || "unknown type"}).`);
    bytes = Buffer.from(await response.arrayBuffer());
  } else {
    const file = path.resolve(input.replace(/^~(?=$|[\\/])/, process.env.USERPROFILE || process.env.HOME || "~"));
    if (!existsSync(file) || !statSync(file).isFile()) throw new Error(`File not found: ${file}`);
    ext = path.extname(file).slice(1).toLowerCase();
    if (!IMAGE_EXTS.has(ext)) throw new Error("Use a jpg, png, webp, gif or avif image.");
    if (ext === "jpeg") ext = "jpg";
    bytes = readFileSync(file);
  }

  if (bytes.length > MAX_IMAGE_BYTES) {
    throw new Error(`Image is ${(bytes.length / 1048576).toFixed(1)} MB; the limit is 5 MB.`);
  }

  const dir = path.join(UPLOAD_DIR, folder);
  mkdirSync(dir, { recursive: true });
  const name = `${slugify(label)}-${randomUUID().slice(0, 8)}.${ext}`;
  writeFileSync(path.join(dir, name), bytes);
  return `/uploads/${folder}/${name}`;
}

// ------------------------------------------------------------------ blog lookup

function decodeEntities(text) {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&#x27;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)));
}

function metaContent(html, property) {
  for (const tag of html.match(/<meta\b[^>]*>/gi) || []) {
    const isMatch = new RegExp(`(?:property|name)=["']${property}["']`, "i").test(tag);
    const content = tag.match(/content=(?:"([^"]*)"|'([^']*)')/i);
    if (isMatch && content) return decodeEntities(content[1] ?? content[2] ?? "").trim();
  }
  return "";
}

// Best-effort: grab the post title and cover image from the page's Open Graph tags.
async function lookupPost(url) {
  try {
    const response = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 portfolio-cli" },
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) return null;
    const html = await response.text();
    const title =
      metaContent(html, "og:title") ||
      decodeEntities((html.match(/<title[^>]*>([^<]*)<\/title>/i) || [])[1] || "").trim();
    return { title, image: metaContent(html, "og:image") };
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------- field editing

function cleanUrl(value, fallback = "") {
  if (!value) return fallback;
  if (value.startsWith("#") || (value.startsWith("/") && !value.startsWith("//"))) return value;
  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:" || parsed.protocol === "http:" ? parsed.toString() : fallback;
  } catch {
    return fallback;
  }
}

function display(field, value) {
  if (field.list) return (value || []).join(", ");
  return value ?? "";
}

// Asks for one field. `current` is the existing value (edit) or a suggested default (add).
// Returns the new value; throws nothing the caller can't recover from.
async function askField(def, field, current, item, isNew) {
  const shown = display(field, current);
  const hint = field.image
    ? shown
      ? ` [${shown}] (Enter keeps, - removes)`
      : " (Enter to skip)"
    : shown
      ? ` [${shown}]`
      : "";

  for (;;) {
    const raw = await ask(`${field.label}${hint}: `);

    if (!raw) {
      if (shown) return current;
      if (field.required && isNew) {
        console.log("This one is required.");
        continue;
      }
      return field.list ? [] : (field.fallback ?? "");
    }

    if (field.image) {
      if (raw === "-") {
        return "";
      }
      try {
        const label = item.title || item.name || def.title;
        const stored = await storeImage(raw, def.upload, label);
        console.log(`  saved as ${stored}`);
        return stored;
      } catch (error) {
        console.log(`  ${error.message}`);
        continue;
      }
    }

    if (field.url) {
      const cleaned = cleanUrl(raw, "");
      if (!cleaned) {
        console.log("Enter a full http(s) link.");
        continue;
      }
      return cleaned;
    }

    if (field.list) {
      return raw
        .split(",")
        .map((part) => part.trim())
        .filter(Boolean)
        .slice(0, 12);
    }

    return raw;
  }
}

async function fillItem(name, existing) {
  const def = collections[name];
  const isNew = !existing;
  const item = { id: existing?.id ?? randomUUID().slice(0, 8), ...(existing ?? {}) };

  for (const field of def.fields) {
    let suggested = item[field.key];

    // Blogspot: fetch title + cover image from the URL we just collected.
    if (name === "blogCards" && field.key === "title" && isNew) {
      console.log("Looking up the post...");
      const info = await lookupPost(item.href);
      if (info) {
        item.title = info.title;
        item._ogImage = info.image;
        suggested = info.title;
        console.log(info.title ? `  found: ${info.title}` : "  no title found, enter one.");
      } else {
        console.log("  couldn't reach the page; enter details by hand.");
      }
    }

    if (name === "blogCards" && field.key === "image" && isNew && item._ogImage) {
      const use = await confirm(`Use the post's cover image?\n  ${item._ogImage}`);
      if (use) {
        try {
          item.image = await storeImage(item._ogImage, def.upload, item.title);
          console.log(`  saved as ${item.image}`);
          continue;
        } catch (error) {
          console.log(`  ${error.message}`);
        }
      }
    }

    const before = item[field.key];
    const value = await askField(def, field, suggested, item, isNew);
    item[field.key] = value;

    // Replaced or removed an image on edit: clean up the old upload.
    if (field.image && before && before !== value) pendingDeletes.push(before);
  }

  delete item._ogImage;
  return item;
}

const pendingDeletes = [];

// ----------------------------------------------------------------- git helpers

function git(args, options = {}) {
  return execFileSync("git", args, { cwd: ROOT, encoding: "utf8", ...options });
}

function contentChanges() {
  try {
    return git(["status", "--porcelain", "--", "content", "public/uploads"], {
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    return null;
  }
}

async function publish() {
  const changes = contentChanges();

  if (changes === null) {
    console.log("\nThis folder isn't a git repository (or git isn't installed).");
    return;
  }
  if (!changes) {
    console.log("\nNothing to publish: content and uploads match what's committed.");
    return;
  }

  console.log("\nChanges to publish:");
  console.log(changes.split("\n").map((line) => `  ${line}`).join("\n"));

  const message = (await ask("\nCommit message (Enter for 'Update content'): ")) || "Update content";
  if (!(await confirm("Commit and push now? Netlify will redeploy."))) {
    console.log("Left uncommitted. Run Publish again whenever you're ready.");
    return;
  }

  try {
    git(["add", "--", "content", "public/uploads"]);
    git(["commit", "-m", message, "--", "content", "public/uploads"], { stdio: "inherit" });
    git(["push"], { stdio: "inherit" });
    console.log("\nPushed. Your site will update once Netlify finishes building.");
  } catch {
    console.log("\nGit reported an error (see above). Your changes are saved locally.");
  }
}

// -------------------------------------------------------------------- menus

async function manage(name) {
  const def = collections[name];

  for (;;) {
    const items = readCollection(name);
    console.log(`\n=== ${def.title} (${items.length}) ===`);
    if (items.length === 0) console.log("  (empty)");
    items.forEach((item, index) => console.log(`  ${index + 1}. ${def.summary(item)}`));

    const action = await choose("What now?", ["Add", "Edit", "Delete", "Move (reorder)", "Back"]);

    if (action === 0) {
      if (items.length >= 100) {
        console.log("Limit of 100 items reached.");
        continue;
      }
      const item = await fillItem(name, null);
      items.push(item);
      writeCollection(name, items);
      console.log(`\nAdded "${item.title || item.name}".`);
    } else if (action === 1 && items.length) {
      const index = await pickItem(items, "edit");
      if (index < 0) continue;
      console.log("Press Enter on any field to keep its current value.");
      items[index] = await fillItem(name, items[index]);
      writeCollection(name, items);
      pendingDeletes.splice(0).forEach(deleteUploadIfUnused);
      console.log("Saved.");
    } else if (action === 2 && items.length) {
      const index = await pickItem(items, "delete");
      if (index < 0) continue;
      if (!(await confirm(`Delete "${items[index].title || items[index].name}"?`, false))) continue;
      const [removed] = items.splice(index, 1);
      writeCollection(name, items);
      for (const field of def.fields.filter((f) => f.image)) deleteUploadIfUnused(removed[field.key]);
      console.log("Deleted.");
    } else if (action === 3 && items.length > 1) {
      const from = await pickItem(items, "move");
      if (from < 0) continue;
      const raw = await ask(`Move to position (1-${items.length}): `);
      const to = Number.parseInt(raw, 10) - 1;
      if (!(to >= 0 && to < items.length)) {
        console.log("Not a valid position.");
        continue;
      }
      const [moved] = items.splice(from, 1);
      items.splice(to, 0, moved);
      writeCollection(name, items);
    } else if (action === 4) {
      return;
    } else {
      console.log("Nothing to do here yet.");
    }
  }
}

async function main() {
  console.log("Portfolio content editor");
  console.log("Edits save to content/ on this machine. Choose Publish to push them live.");

  const names = Object.keys(collections);

  for (;;) {
    const pending = contentChanges();
    const labels = names.map((name) => `${collections[name].title} (${readCollection(name).length})`);
    const pick = await choose(
      pending ? "Main menu  (* unpublished changes)" : "Main menu",
      [...labels, "Publish (commit + push)", "Quit"],
    );

    if (pick < names.length) {
      await manage(names[pick]);
    } else if (pick === names.length) {
      await publish();
    } else {
      if (contentChanges() && (await confirm("You have unpublished changes. Publish before quitting?"))) {
        await publish();
      }
      return;
    }
  }
}

try {
  await main();
} catch (error) {
  if (!(error instanceof InputEnded)) {
    console.error(error);
    process.exitCode = 1;
  } else {
    console.log("\nBye.");
  }
} finally {
  rl.close();
}
