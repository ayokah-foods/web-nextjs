"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import GoogleOneTap from "@/lib/providers";


const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fill="#FFC107"
      d="M43.611 20.083H42V20H24v8h11.303c-1.659 5.591-6.08 9.421-11.303 9.421-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
    />
    <path
      fill="#FF3D00"
      d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
    />
    <path
      fill="#4CAF50"
      d="m24 44c5.166 0 9.86-1.977 13.214-5.192l-5.657-5.657C30.046 35.66 27.268 37 24 37c-5.218 0-9.641-3.421-11.303-8.181l-6.571 4.819C9.656 40.063 16.318 44 24 44z"
    />
    <path
      fill="#1976D2"
      d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.191 4.196-4.01 5.613l6.571 4.819C40.098 34.69 43.13 29.58 43.611 20.083z"
    />
  </svg>
);



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
export default function LoginPage() { 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  
const handleGoogleSignIn = () => {
  // Only proceed if the google object is available
  console.log("Google Sign-In button clicked");
  if (window.google?.accounts.id) {
    // --- ADDED SAFEGUARD INITIALIZATION HERE ---
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) {
      console.error("CLIENT_ID is missing from environment variables.");
      return;
    }

    // Re-initialize (or confirm initialization) right before prompting
    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: (response) => {
        // Keep the same callback as in your GoogleOneTap component
        console.log("Credential:", response.credential);
      },
      auto_select: false,
      cancel_on_tap_outside: true,
    });
    // --- END ADDED SAFEGUARD ---

    window.google.accounts.id.prompt();
  } else {
    console.error("Google Identity Services not initialized.");
  }
};

  return (
    <div className="min-h-screen flex">
      <GoogleOneTap />
      {/* Left Column: Image (Hidden on small screens) */}
      <div className="relative hidden lg:block h-full">
        {/* Replaced Next/Image with standard <img> */}
        <img
          src="https://placehold.co/1200x1600/FDE8C7/333333?text=African+Market+Hub"
          alt="A woman in traditional African attire"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black opacity-10"></div>
      </div>
      {/* Right Column: Form (Full width on small screens) */}
      <div className="flex items-center justify-center p-8 sm:p-12 w-full">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <Link href="/">
              <Image
                src="/images/logo.svg"
                alt="African Market Hub"
                width={180}
                height={40}
                style={{ height: "40px" }}
                priority
              />
            </Link>
          </div>

          <h1
            hidden
            className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center"
          >
            Log in
          </h1>

          {/* Separator */}
          <div className="my-6 flex items-center justify-center">
            <div className="grow border-t border-gray-300"></div>
            <span className="mx-4 text-sm text-gray-500"> continue with</span>
            <div className="grow border-t border-gray-300"></div>
          </div>

          {/* Google Button */}
          <div>
            <button
              type="button"
              // Remove id="signInDiv" as it's no longer needed for rendering
              onClick={handleGoogleSignIn} // Re-attach click handler
              disabled={loading}
              className="w-full cursor-pointer flex justify-center items-center gap-3 py-3 px-4 border border-gray-300 rounded-full shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-60"
            >
                            <GoogleIcon className="w-5 h-5" />             
              Google            {" "}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
