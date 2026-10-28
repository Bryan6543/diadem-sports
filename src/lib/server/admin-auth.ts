import "server-only";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { env, hasAdmin } from "./env";

export const ADMIN_COOKIE = "ds_admin";
const SESSION_SECONDS = 8 * 60 * 60;

const sign = (payload: string) => createHmac("sha256", env.adminSecret!).update(payload).digest("base64url");

/** Constant-time string comparison (hashing first so lengths always match). */
export function safeEqual(a: string, b: string) {
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}

export function checkCredentials(email: string, password: string) {
  if (!hasAdmin()) return false;
  const emailOk = safeEqual(email.trim().toLowerCase(), env.adminEmail!.toLowerCase());
  const passOk = safeEqual(password, env.adminPassword!);
  return emailOk && passOk;
}

export function createSessionToken(email: string) {
  const payload = Buffer.from(JSON.stringify({ e: email, x: Math.floor(Date.now() / 1000) + SESSION_SECONDS })).toString(
    "base64url",
  );
  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token: string | undefined) {
  if (!token || !hasAdmin()) return null;
  const [payload, sig] = token.split(".");
  if (!payload || !sig || !safeEqual(sig, sign(payload))) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString()) as { e: string; x: number };
    if (data.x < Math.floor(Date.now() / 1000)) return null;
    return { email: data.e };
  } catch {
    return null;
  }
}

export async function setSessionCookie(email: string) {
  const jar = await cookies();
  jar.set(ADMIN_COOKIE, createSessionToken(email), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_SECONDS,
  });
}

export async function clearSessionCookie() {
  const jar = await cookies();
  jar.delete(ADMIN_COOKIE);
}

export async function getAdminSession() {
  const jar = await cookies();
  return verifySessionToken(jar.get(ADMIN_COOKIE)?.value);
}

/** Call at the top of every admin page and server action. */
export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return session;
}
