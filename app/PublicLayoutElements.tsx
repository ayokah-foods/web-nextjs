"use client";

import React from "react";
import { useAuthStore } from "@/store/useAuthStore";
import TopHeader from "./components/TopHeader";
import NavBar from "./components/NavBar";
 
export default function PublicLayoutElements() {
  const { user, _hasHydrated } = useAuthStore();
  if (!_hasHydrated) {
    return null;
  }
  const isVendorAuthenticated = user && user.role === "vendor";
  if (isVendorAuthenticated) {
    return null;
  }

  return (
    <>
      <TopHeader />
      <NavBar />
    </>
  );
}
