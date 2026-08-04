import { settings } from "@/lib/settings";

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

export const ADMIN_SESSION_COOKIE =
  process.env.ADMIN_COOKIE_NAME || "portfolio_admin_session";
export const ADMIN_PASSWORD_TABLE = "admin_settings";
export const ADMIN_PASSWORD_ROW_ID = 1;
export const PBKDF2_ITERATIONS = 310000;
export const PASSWORD_SALT_BYTES = 16;

function getSecret() {
  const secret = settings.adminSessionSecret;

  if (!secret || secret.length < 32) {
    throw new Error("ADMIN_SESSION_SECRET must be at least 32 characters.");
  }

  return secret;
}

function bytesToBase64Url(bytes: Uint8Array) {
  let binary = "";

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function base64UrlToBytes(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padding = (4 - (normalized.length % 4)) % 4;
  const binary = atob(normalized + "=".repeat(padding));
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return bytes;
}

async function importSecretKey(usage: "sign" | "verify") {
  return crypto.subtle.importKey(
    "raw",
    textEncoder.encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    [usage],
  );
}

async function derivePasswordHash(password: string, salt: Uint8Array) {
  const saltBuffer = salt.buffer.slice(
    salt.byteOffset,
    salt.byteOffset + salt.byteLength,
  ) as ArrayBuffer;
  const key = await crypto.subtle.importKey(
    "raw",
    textEncoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );

  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: saltBuffer,
      iterations: PBKDF2_ITERATIONS,
      hash: "SHA-256",
    },
    key,
    256,
  );

  return new Uint8Array(bits);
}

function constantTimeEquals(left: Uint8Array, right: Uint8Array) {
  if (left.length !== right.length) {
    return false;
  }

  let result = 0;

  for (let index = 0; index < left.length; index += 1) {
    result |= left[index] ^ right[index];
  }

  return result === 0;
}

export async function hashPassword(password: string) {
  const salt = crypto.getRandomValues(new Uint8Array(PASSWORD_SALT_BYTES));
  const hash = await derivePasswordHash(password, salt);

  return [
    "pbkdf2_sha256",
    String(PBKDF2_ITERATIONS),
    bytesToBase64Url(salt),
    bytesToBase64Url(hash),
  ].join("$");
}

export async function verifyPassword(password: string, storedHash: string) {
  const [algorithm, iterationValue, saltValue, hashValue] =
    storedHash.split("$");

  if (
    algorithm !== "pbkdf2_sha256" ||
    !iterationValue ||
    Number.parseInt(iterationValue, 10) !== PBKDF2_ITERATIONS ||
    !saltValue ||
    !hashValue
  ) {
    return false;
  }

  const salt = base64UrlToBytes(saltValue);
  const expected = base64UrlToBytes(hashValue);
  const actual = await derivePasswordHash(password, salt);

  return constantTimeEquals(actual, expected);
}

export async function createSessionToken(subject: string) {
  const now = Math.floor(Date.now() / 1000);
  const maxAge = Number.isFinite(settings.adminSessionMaxAgeSeconds)
    ? settings.adminSessionMaxAgeSeconds
    : 60 * 60;
  const payload = {
    sub: subject,
    iat: now,
    exp: now + maxAge,
  };
  const payloadBytes = textEncoder.encode(JSON.stringify(payload));
  const key = await importSecretKey("sign");
  const signature = new Uint8Array(
    await crypto.subtle.sign("HMAC", key, payloadBytes),
  );

  return `${bytesToBase64Url(payloadBytes)}.${bytesToBase64Url(signature)}`;
}

export async function verifySessionToken(token: string) {
  const [payloadValue, signatureValue] = token.split(".");

  if (!payloadValue || !signatureValue) {
    return false;
  }

  try {
    const payloadBytes = base64UrlToBytes(payloadValue);
    const signatureBytes = base64UrlToBytes(signatureValue);
    const key = await importSecretKey("verify");
    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      signatureBytes,
      payloadBytes,
    );

    if (!isValid) {
      return false;
    }

    const payload = JSON.parse(textDecoder.decode(payloadBytes)) as {
      exp?: number;
    };

    return typeof payload.exp === "number" && payload.exp > Date.now() / 1000;
  } catch {
    return false;
  }
}

export function sanitizeRedirectPath(value: string | null | undefined) {
  if (!value || !value.startsWith("/")) {
    return "/admin";
  }

  if (value.startsWith("//")) {
    return "/admin";
  }

  return value;
}
