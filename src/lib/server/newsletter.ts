import "server-only";
import { z } from "zod";
import { site } from "@/data/site";
import { absoluteUrl } from "@/lib/utils";
import { env, hasResend, hasSupabase } from "./env";
import { fromAddress, getResend } from "./resend";
import { getSupabase } from "./supabase";

export const subscribeSchema = z.object({
  email: z.string().trim().toLowerCase().max(254).pipe(z.email("Please enter a valid email address.")),
  name: z.string().trim().max(80).optional().default(""),
  source: z.string().trim().max(40).default("footer"),
});

export type NewsletterResult =
  | { ok: true; status: "subscribed" | "resubscribed" | "already" }
  | { ok: false; error: string };

export const UNAVAILABLE = "Sign-ups are temporarily unavailable. Please try again later.";

export async function subscribe(input: z.input<typeof subscribeSchema>): Promise<NewsletterResult> {
  const parsed = subscribeSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid email." };
  if (!hasSupabase()) return { ok: false, error: UNAVAILABLE };
  const db = getSupabase()!;
  const { email, name, source } = parsed.data;

  const { data: existing, error: findErr } = await db
    .from("subscribers")
    .select("id, status, unsubscribe_token")
    .ilike("email", email)
    .maybeSingle();
  if (findErr) return { ok: false, error: UNAVAILABLE };

  let token: string;
  let status: "subscribed" | "resubscribed" | "already";
  if (existing?.status === "active") {
    return { ok: true, status: "already" };
  } else if (existing) {
    const { error } = await db
      .from("subscribers")
      .update({ status: "active", source, name: name || null, updated_at: new Date().toISOString() })
      .eq("id", existing.id);
    if (error) return { ok: false, error: UNAVAILABLE };
    token = existing.unsubscribe_token;
    status = "resubscribed";
  } else {
    const { data, error } = await db
      .from("subscribers")
      .insert({ email, name: name || null, source })
      .select("unsubscribe_token")
      .single();
    if (error || !data) return { ok: false, error: UNAVAILABLE };
    token = data.unsubscribe_token;
    status = "subscribed";
  }

  await syncResendContact(email, name, false);
  await sendWelcome(email, token);
  return { ok: true, status };
}

async function syncResendContact(email: string, name: string, unsubscribed: boolean) {
  const resend = getResend();
  if (!resend) return;
  try {
    const { data, error } = await resend.contacts.create({
      email,
      firstName: name || undefined,
      unsubscribed,
      ...(env.resendSegmentId ? { segments: [{ id: env.resendSegmentId }] } : {}),
    });
    if (data?.id) {
      await getSupabase()?.from("subscribers").update({ resend_contact_id: data.id }).ilike("email", email);
    } else if (error) {
      // Most likely the contact already exists — update its subscription state instead.
      await resend.contacts.update({ email, unsubscribed });
    }
  } catch (err) {
    console.error("[newsletter] resend contact sync failed:", (err as Error).message);
  }
}

function unsubscribeLinks(token: string) {
  return {
    page: absoluteUrl(`/unsubscribe?token=${token}`),
    oneClick: absoluteUrl(`/api/unsubscribe?token=${token}`),
  };
}

async function sendWelcome(email: string, token: string) {
  const resend = getResend();
  if (!resend || !hasResend()) return;
  const links = unsubscribeLinks(token);
  try {
    await resend.emails.send({
      from: fromAddress(),
      to: email,
      subject: "Welcome to Diadem Sri Lanka",
      headers: {
        "List-Unsubscribe": `<${links.oneClick}>`,
        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
      },
      html: `<!doctype html><html><body style="margin:0;background:#f3f5f6;font-family:Arial,Helvetica,sans-serif;color:#16181a">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:32px 16px">
<table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff">
<tr><td style="background:#0b0b0c;padding:28px 32px;color:#3fc3cb;font-size:12px;letter-spacing:3px;text-transform:uppercase;font-weight:bold">Diadem Sri Lanka</td></tr>
<tr><td style="padding:32px">
<h1 style="margin:0 0 16px;font-size:28px;line-height:1.1;text-transform:uppercase">You're on the list.</h1>
<p style="margin:0 0 16px;line-height:1.6">Thanks for signing up. We'll send you new Diadem arrivals, stories and news from ${site.retailer.name} — no more than a few emails a month.</p>
<p style="margin:0 0 24px;line-height:1.6">In the meantime, explore the full range.</p>
<a href="${absoluteUrl("/products")}" style="display:inline-block;background:#006a71;color:#ffffff;padding:14px 22px;text-decoration:none;font-weight:bold;text-transform:uppercase;letter-spacing:1px;font-size:13px">Explore Diadem</a>
</td></tr>
<tr><td style="padding:20px 32px;border-top:1px solid #e3e5e7;font-size:12px;line-height:1.6;color:#6b7075">
${site.retailer.legalName} · ${site.retailer.stores[0].address}<br>
<a href="${links.page}" style="color:#006a71">Unsubscribe</a> at any time.
</td></tr></table></td></tr></table></body></html>`,
      text: `You're on the list.\n\nThanks for signing up to Diadem Sri Lanka. Explore the range: ${absoluteUrl("/products")}\n\nUnsubscribe: ${links.page}\n${site.retailer.legalName}`,
    });
  } catch (err) {
    console.error("[newsletter] welcome email failed:", (err as Error).message);
  }
}

const tokenSchema = z.string().uuid();

export async function findByToken(token: string) {
  if (!tokenSchema.safeParse(token).success || !hasSupabase()) return null;
  const { data } = await getSupabase()!
    .from("subscribers")
    .select("email, status")
    .eq("unsubscribe_token", token)
    .maybeSingle();
  return data as { email: string; status: "active" | "unsubscribed" } | null;
}

export async function setSubscriptionByToken(token: string, active: boolean) {
  if (!tokenSchema.safeParse(token).success || !hasSupabase()) return false;
  const { data, error } = await getSupabase()!
    .from("subscribers")
    .update({ status: active ? "active" : "unsubscribed", updated_at: new Date().toISOString() })
    .eq("unsubscribe_token", token)
    .select("email")
    .maybeSingle();
  if (error || !data) return false;
  await syncResendContact(data.email, "", !active);
  return true;
}
