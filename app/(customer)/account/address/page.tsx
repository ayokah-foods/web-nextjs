"use client";
import ShippingSection from "../sections/ShippingSection";
import { useAuthStore } from "@/store/useAuthStore";

export default function AddressBook() {
  const user = useAuthStore((state) => state.user);

  return <ShippingSection user={user} />;
}