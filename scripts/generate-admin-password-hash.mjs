#!/usr/bin/env node
import readline from "readline";
import crypto from "crypto";

const PBKDF2_ITERATIONS = 310000;
const PASSWORD_SALT_BYTES = 16;

function toBase64Url(buffer) {
  return buffer
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function generateHash(password) {
  const salt = crypto.randomBytes(PASSWORD_SALT_BYTES);
  const hash = crypto.pbkdf2Sync(
    password,
    salt,
    PBKDF2_ITERATIONS,
    32,
    "sha256",
  );

  return [
    "pbkdf2_sha256",
    String(PBKDF2_ITERATIONS),
    toBase64Url(salt),
    toBase64Url(hash),
  ].join("$");
}

async function promptPassword() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const question = (q) => new Promise((res) => rl.question(q, res));

  try {
    const p1 = await question("Enter new admin password: ");
    const p2 = await question("Confirm password: ");

    rl.close();

    if (!p1 || p1 !== p2) {
      console.error("Passwords do not match or empty.");
      process.exit(2);
    }

    const hash = generateHash(p1);
    console.log(
      "\nCopy this value into your Supabase `admin_settings` table (id=1) as `password_hash`:",
    );
    console.log(hash);
  } catch (err) {
    rl.close();
    console.error(err);
    process.exit(1);
  }
}

const envPassword = process.env.ADMIN_PASSWORD || process.env.PASSWORD;

if (envPassword) {
  console.log(generateHash(envPassword));
  process.exit(0);
} else {
  promptPassword();
}
