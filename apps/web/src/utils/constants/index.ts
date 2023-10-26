export const APP_NAME = "SupaBot AI";
export const DOMAIN = "supabotai.com";
export const SUPPORT_EMAIL = "support@supabotai.com";

export const GITHUB_REPO = "https://github.com/iam-rohid/supabot-ai";
export const TWITTER_URL = "https://twitter.com/supabotai";

export const BASE_URL =
  process.env.NEXT_PUBLIC_VERCEL_ENV === "production"
    ? `https://${DOMAIN}`
    : process.env.NEXT_PUBLIC_VERCEL_ENV === "preview"
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
    : "http://localhost:3000";

export const WIDGETS_BASE_URL =
  process.env.NEXT_PUBLIC_VERCEL_ENV === "production"
    ? `https://widgets.${DOMAIN}`
    : "http://localhost:3002";

export const REDIRECTS: Record<string, string> = {
  discord: "https://discord.gg/muz5fkkS",
  twitter: "https://twitter.com/SupaBotAI",
  github: "https://github.com/iam-rohid/supabot-ai",
  issues: "https://github.com/iam-rohid/supabot-ai/issues",
  docs:
    process.env.NODE_ENV === "production"
      ? `https://docs.${DOMAIN}`
      : "http://localhost:3001",
};

export const PUBLIC_PATH_NAMES = new Set([
  "home",
  "widgets",
  "api",
  "blog",
  "pricing",
  "changelog",
  "contact",
  "help",
  "privacy",
  "terms",
  "abuse",
  "legal",
  ...Object.keys(REDIRECTS),
]);

export const INVALID_ORG_SLUGS = new Set([
  ...PUBLIC_PATH_NAMES,
  "create-org",
  "demo",
  "register",
  "signin",
  "signup",
  "sign-in",
  "sign-up",
  "dashboard",
  "settings",
]);
