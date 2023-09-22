export const APP_NAME = "SupaBot AI";
export const DOMAIN = "supabotai.com";
export const SUPPORT_EMAIL = "support@supabotai.com";

export const GITHUB_REPO = "https://github.com/iam-rohid/supabot-ai";
export const TWITTER_URL = "https://twitter.com/supabotai";

export const BASE_DOMAIN =
  process.env.NEXT_PUBLIC_VERCEL_ENV === "production"
    ? `https://${DOMAIN}`
    : process.env.NEXT_PUBLIC_VERCEL_ENV === "preview"
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
    : "http://localhost:3000";
