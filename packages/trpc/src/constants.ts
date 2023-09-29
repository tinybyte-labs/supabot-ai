export const APP_NAME = "SupaBot AI";

export const BASE_URL =
  process.env.NEXT_PUBLIC_VERCEL_ENV === "production"
    ? `https://supabotai.com`
    : process.env.NEXT_PUBLIC_VERCEL_ENV === "preview"
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
    : "http://localhost:3000";
