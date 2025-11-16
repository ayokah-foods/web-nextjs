// lib/providers.tsx

"use client";

import { useEffect } from "react";
import { GoogleCredentialResponse } from "./api/auth/login";


declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (options: {
            client_id: string;
            callback: (response: CredentialResponse) => void;
            auto_select?: boolean;
            cancel_on_tap_outside?: boolean;
          }) => void;
          prompt: () => void;
        };
      };
    };
  }
}

type CredentialResponse = {
  credential?: string;
  select_by?: string;
  clientId?: string;
};

export default function GoogleOneTap() {
  useEffect(() => {
    const handleLoad = () => {
      if (!window.google?.accounts?.id) {
        console.error("Google SDK loaded but google.accounts.id missing");
        return;
      }
      const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
      if (!clientId) {
        console.error("CLIENT_ID is undefined");
        return;
      }

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: (response) => {
          console.log("Credential:", response.credential);
        },
        auto_select: false,
        cancel_on_tap_outside: true,
      });
 
    };

    window.addEventListener("google-script-loaded", handleLoad);

    return () => {
      window.removeEventListener("google-script-loaded", handleLoad);
    };
  }, []);

  return null;
}
