import "server-only";
import { Resend } from "resend";
import { env, hasResend } from "./env";

let client: Resend | null = null;

export function getResend(): Resend | null {
  if (!hasResend()) return null;
  client ??= new Resend(env.resendKey);
  return client;
}

export const fromAddress = () => env.resendFrom!;
