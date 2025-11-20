"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation"; 
import PulseLoader from "react-spinners/PulseLoader";
import { useAuthStore } from "@/store/useAuthStore";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";

interface SellerLayoutProps {
  children: React.ReactNode;
}

export default function SellerLayout({ children }: SellerLayoutProps) {
  const { token, _hasHydrated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (_hasHydrated && !token) {
      router.replace("/login");
    }
  }, [token, _hasHydrated, router]);

  if (!_hasHydrated || !token) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <PulseLoader color="#ff6600" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header />
        <main className="flex-1 p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}
