import "./globals.css";
import { Instrument_Sans } from "next/font/google";
import type { Metadata } from "next";
import SplashScreen from "./components/SplashScreen";
import TopHeader from "./components/TopHeader";
import NavBar from "./components/NavBar";
import Providers from "./providers";
import Footer from "./components/Footer";
import { CartProvider } from "@/context/CartContext";
import { Toaster } from "react-hot-toast";
import Script from "next/script";

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-instrument-sans",
});

export const metadata: Metadata = {
  title: "Ayokah Foods and Services",
  manifest: "/site.webmanifest",
  description:
    "Buy authentic African groceries, clothes, and the best African foods online. Ayokah Foods and Services brings you fresh ingredients, fashion, and essentials from Africa — all in one trusted online marketplace.",
  keywords: [
    "African groceries",
    "African clothes",
    "African foods",
    "online African market",
    "buy African products",
    "African fashion",
    "African marketplace",
    "Afrovending",
  ],
  openGraph: {
    title: "Ayokah Foods and Services | African Groceries, Clothes & Foods",
    description:
      "Buy authentic African groceries, clothes, and foods online. Ayokah Foods and Services delivers Africa’s best — fresh ingredients, fashion & essentials — right to your door.",
    url: "https://ayokah.co.uk",
    siteName: "Ayokah Foods and Services",
    images: [
      {
        url: "https://ayokah.co.uk/OpenGraph.png",
        width: 1200,
        height: 630,
        alt: "Ayokah Foods and Services - African Online Market",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ayokah Foods and Services | African Groceries, Clothes & Foods",
    description:
      "Shop authentic African groceries, clothes & foods online. Ayokah Foods and Services delivers Africa’s best directly to your home.",
    images: ["https://ayokah.co.uk/Twitter.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${instrumentSans.variable}`}>
      <body
        className={`antialiased bg-orange-50 h-full flex flex-col`}
      >
        <Script
          src="https://accounts.google.com/gsi/client"
          strategy="afterInteractive"
        />

        <Providers>
          <CartProvider>
            <TopHeader />
            <NavBar />
            {children}
            <SplashScreen />
            <Footer />
          </CartProvider>
        </Providers>

        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
          strategy="beforeInteractive"
        />

        <Toaster />
      </body>
    </html>
  );
}
