import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "uk.co.ayokah",
  appName: "ayokah_foods_and_services",
  webDir: "public",
  server: {
    url: "https://ayokah.co.uk",
    cleartext: true,
  },
};

export default config;
