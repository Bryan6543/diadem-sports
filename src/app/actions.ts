"use server";

import { z } from "zod";
import { site } from "@/data/site";
import { env, hasResend } from "@/lib/server/env";
import { setSubscriptionByToken, subscribe } from "@/lib/server/newsletter";
import { rateLimit } from "@/lib/server/rate-limit";
import { clientIp } from "@/lib/server/request";
import { fromAddress, getResend } from "@/lib/server/resend";

export interface FormState {
  ok: boolean;
  message: string;
  fieldErrors?: Record<string, string>;
}

export async function subscribeAction(_prev: FormState | null, formData: FormData): Promise<FormState> {
  // Honeypot: real people never fill the hidden "website" field.
  if (String(formData.get("website") ?? "")) return { ok: true, message: "Thanks — you're on the list." };
  const ip = await clientIp();
  if (!(await rateLimit(`newsletter:${ip}`, 5, 600))) {
    return { ok: false, message: "Too many attempts. Please wait a few minutes and try again." };
  }
  const result = await subscribe({
    email: String(formData.get("email") ?? ""),
    name: String(formData.get("name") ?? ""),
    source: String(formData.get("source") ?? "footer"),
  });
  if (!result.ok) return { ok: false, message: result.error };
  return {
    ok: true,
    message:
      result.status === "already"
        ? "You're already subscribed — thank you!"
        : result.status === "resubscribed"
          ? "Welcome back — you're subscribed again."
          : "Thanks — you're on the list. Check your inbox for a welcome email.",
  };
}

const contactSchema = z.object({
  name: z.string().trim().min(2, "Please tell us your name.").max(80),
  email: z.string().trim().max(254).pipe(z.email("Please enter a valid email address.")),
  phone: z.string().trim().max(30).optional().default(""),
  topic: z.enum(["product", "stringing", "sponsorship", "other"]).default("product"),
  message: z.string().trim().min(10, "Please write a little more (10+ characters).").max(4000),
});

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export async function contactAction(_prev: FormState | null, formData: FormData): Promise<FormState> {
  if (String(formData.get("website") ?? "")) return { ok: true, message: "Thanks — we'll be in touch soon." };
  const parsed = contactSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) fieldErrors[String(issue.path[0])] ??= issue.message;
    return { ok: false, message: "Please check the highlighted fields.", fieldErrors };
  }
  const ip = await clientIp();
  if (!(await rateLimit(`contact:${ip}`, 3, 600))) {
    return { ok: false, message: "Too many messages. Please wait a few minutes, or call us instead." };
  }
  const resend = getResend();
  if (!resend || !hasResend()) {
    return {
      ok: false,
      message: `The contact form is temporarily unavailable. Please email ${site.contactEmail} or call ${site.retailer.stores[0].phones[1]}.`,
    };
  }
  const d = parsed.data;
  const { error } = await resend.emails.send({
    from: fromAddress(),
    to: env.contactTo ?? site.contactEmail,
    replyTo: d.email,
    subject: `[diademsports.lk] ${d.topic} enquiry from ${d.name}`,
    text: `Name: ${d.name}\nEmail: ${d.email}\nPhone: ${d.phone || "—"}\nTopic: ${d.topic}\n\n${d.message}`,
    html: `<p><strong>Name:</strong> ${escapeHtml(d.name)}<br><strong>Email:</strong> ${escapeHtml(d.email)}<br><strong>Phone:</strong> ${escapeHtml(d.phone || "—")}<br><strong>Topic:</strong> ${escapeHtml(d.topic)}</p><p style="white-space:pre-wrap">${escapeHtml(d.message)}</p>`,
  });
  if (error) return { ok: false, message: "We couldn't send your message just now. Please try again or call us." };
  return { ok: true, message: "Thanks — your message has been sent. We'll reply as soon as we can." };
}

export async function setSubscriptionAction(_prev: FormState | null, formData: FormData): Promise<FormState> {
  const token = String(formData.get("token") ?? "");
  const active = formData.get("action") === "resubscribe";
  const ok = await setSubscriptionByToken(token, active);
  if (!ok) return { ok: false, message: "That link is invalid or has expired." };
  return {
    ok: true,
    message: active ? "You're subscribed again. Welcome back!" : "You've been unsubscribed. You won't receive any more emails.",
  };
}
