import "server-only";

const read = (k: string) => {
  const v = process.env[k]?.trim();
  return v ? v : undefined;
};

export const env = {
  supabaseUrl: read("SUPABASE_URL"),
  supabaseServiceKey: read("SUPABASE_SERVICE_ROLE_KEY"),
  resendKey: read("RESEND_API_KEY"),
  resendFrom: read("RESEND_FROM"),
  resendSegmentId: read("RESEND_SEGMENT_ID"),
  contactTo: read("CONTACT_TO"),
  adminEmail: read("ADMIN_EMAIL"),
  adminPassword: read("ADMIN_PASSWORD"),
  adminSecret: read("ADMIN_SESSION_SECRET"),
};

export const hasSupabase = () => Boolean(env.supabaseUrl && env.supabaseServiceKey);
export const hasResend = () => Boolean(env.resendKey && env.resendFrom);
export const hasAdmin = () =>
  Boolean(env.adminEmail && env.adminPassword && env.adminSecret && env.adminSecret.length >= 32);
