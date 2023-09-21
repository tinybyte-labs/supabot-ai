export const MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "";

export const pageView = (page_path: string) => {
  if (!MEASUREMENT_ID) return;
  gtag("config", MEASUREMENT_ID, {
    page_path,
  });
};
