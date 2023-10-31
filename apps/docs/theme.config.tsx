import { DocsThemeConfig } from "nextra-theme-docs";
import FullLogo from "./components/FullLogo";

const config: DocsThemeConfig = {
  logo: <FullLogo />,
  project: {
    link: "https://github.com/iam-rohid/supabot-ai",
  },
  chat: {
    link: "https://discord.com/invite/muz5fkkS",
  },
  docsRepositoryBase:
    "https://github.com/iam-rohid/supabot-ai/tree/main/apps/docs",
  footer: {
    text: "SupaBot AI Documentation",
  },
  useNextSeoProps: () => {
    return {
      title: "SupaBot AI Documentation",
      titleTemplate: "%s | SupaBot AI Documentation",
    };
  },
};

export default config;
