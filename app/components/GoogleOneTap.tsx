"use client";

import { ContinueWithGoogle } from "@/lib/api/auth/login";
import { useEffect } from "react";

export default function GoogleOneTap() {
  useEffect(() => {
    if (!window.google?.accounts?.id) {
      console.log("Google SDK not ready yet");
      return;
    }

    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) {
      console.error("Google client ID missing");
      return;
    }

    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: async (response: any) => {
        console.log("Google Credential:", response.credential);

        await ContinueWithGoogle({
          id_token: response.credential,
          device_name: navigator.userAgent,
        });
      },
    });

    window.google.accounts.id.prompt();
  }, []);

  return null;
}
