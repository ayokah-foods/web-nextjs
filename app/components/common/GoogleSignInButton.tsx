// app/components/common/GoogleSignInButton.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRightCircleIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast"; // Assuming you use react-hot-toast
import { ContinueWithGoogle } from "@/lib/api/auth/login"; // Ensure this path is correct

// Import the official GSI type for the callback response from the global window object.
// We are using 'any' for the window object below, but we define the type structure here for clarity.
// The GSI library provides 'CredentialResponse', which has 'credential: string | undefined'.
// We don't redefine the interface as GoogleCredentialResponse, we use the property structure directly.
interface GoogleUserPayload {
  name: string;
  given_name: string;
  family_name: string;
  sub: string;
  picture: string;
  email: string;
}

// NOTE: We don't define GoogleCredentialResponse anymore to fix the type mismatch (Error 2322).
// We'll rely on the runtime check inside the handler.

const decodeJWT = (token: string): GoogleUserPayload | null => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    return JSON.parse(jsonPayload) as GoogleUserPayload;
  } catch (e) {
    console.error("Failed to decode JWT:", e);
    return null;
  }
};

// --- REACT COMPONENT ---
export default function GoogleSignInButton() {
  const router = useRouter(); // Initialize router
  const [isSdkLoaded, setIsSdkLoaded] = useState(false);
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  // 1. Define the handler inside the component to access router, toast, and API.
  // We use the basic object structure to avoid strict type conflicts (Error 2322)
  const handleCredentialResponse = async (response: {
    credential?: string; // Using optional string for safety
    select_by: string; // Other fields as needed
  }) => {
    const id_token = response.credential;
    console.log("Received ID Token from Google:", id_token);
    if (!id_token) {
      console.error("Google response missing credential (ID Token).");
      toast.error("Google login failed: Missing token.");
      return;
    }

    const payload = {
      id_token: id_token,
      device_name: navigator.userAgent,
    };

    try {
      
      const responsePayload = decodeJWT(id_token);
      if (responsePayload) {
        console.log("Decoded JWT Email:", responsePayload.email);
      console.log("Login successful! Token:", payload);

      }

      // API Call
      const result = await ContinueWithGoogle(payload);
      console.log("Login successful! Token:", result.token);
      toast.success("Login successful!");
      router.push("/dashboard");

    } catch (error) {
      console.error("Authentication failed on the server:", error);
      toast.error("Login failed. Please try again.");
      
    }
  };

  useEffect(() => {
    // --- NEW RELIABLE LOADING LOGIC ---
    const initializeGsi = () => {
      const googleAccounts = (window as any).google?.accounts;

      if (!googleAccounts?.id) {
        console.error("GSI library object is not available after load.");
        return;
      }

      if (!clientId) {
        console.error("Client ID is missing. Cannot initialize GSI.");
        return;
      }

      // Initialization
      googleAccounts.id.initialize({
        client_id: clientId,
        callback: handleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      // Rendering
      (googleAccounts.id as any).renderButton(
        document.getElementById("g_id_signin") as HTMLElement,
        {
          theme: "outline",
          size: "large",
          width: "300",
          type: "standard",
        }
      );

      setIsSdkLoaded(true); // Set true ONLY after successful initialization
    };

    // 1. Check immediately (in case the script loaded *before* the component mounted)
    if ((window as any).google?.accounts?.id) {
      initializeGsi();
      return;
    }

    // 2. Add an event listener to wait for the script to load (reliable method)
    // The GSI script dispatches a 'load' event on the window when it's ready.
    window.addEventListener("load", initializeGsi);

    // Cleanup: Remove the event listener when the component unmounts
    return () => {
      window.removeEventListener("load", initializeGsi);
    };
  }, [clientId, handleCredentialResponse]); // Dependencies: clientId and the memoized handler

  if (!isSdkLoaded) {
    return (
      <div className="flex items-center justify-center p-4 border border-gray-300 rounded-lg bg-gray-50">
        <ArrowRightCircleIcon className="w-5 h-5 mr-2 text-gray-500 animate-spin" />
        Loading Sign-In services...
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Sign in to your account
      </h2>

      {/* Target div where Google will render the button */}
      <div id="g_id_signin" className="mb-4"></div>

      <p className="text-sm text-gray-500 mt-2">
        <span className="font-medium text-gray-700">Note:</span> This uses
        Google's official sign-in button.
      </p>
    </div>
  );
}
