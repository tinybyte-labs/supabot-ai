export const MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export const pageView = (page_path: string) => {
  if (!MEASUREMENT_ID) {
    console.log("NEXT_PUBLIC_GA_MEASUREMENT_ID not found!");
    return;
  }
  gtag("config", MEASUREMENT_ID, {
    page_path,
  });
};
