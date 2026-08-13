const encoder = new TextEncoder();
const SESSION_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

async function getKey() {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(process.env.ADMIN_SESSION_SECRET!),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
}

function toHex(buffer: ArrayBuffer) {
  return [...new Uint8Array(buffer)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function createSessionToken() {
  const issuedAt = Date.now().toString();
  const key = await getKey();
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(issuedAt)
  );
  return `${issuedAt}.${toHex(signature)}`;
}

export async function verifySessionToken(token: string | undefined | null) {
  if (!token) return false;

  const [issuedAt, signature] = token.split(".");
  if (!issuedAt || !signature) return false;

  const age = Date.now() - Number(issuedAt);
  if (!Number.isFinite(age) || age < 0 || age > SESSION_MAX_AGE_MS) {
    return false;
  }

  const key = await getKey();
  const expected = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(issuedAt)
  );
  return toHex(expected) === signature;
}

export const ADMIN_SESSION_COOKIE = "admin_session";
