"use client";
import ShippingSection from "../sections/ShippingSection";
import { useAuthStore } from "@/store/useAuthStore";

export default function AddressBook() {
  const user = useAuthStore((state) => state.user);

  return (
    <div>
      {/* Welcome Box */}
      <div className="card mb-6">
        <h2 className="text-lg font-semibold">Shipping Address</h2>
      </div>
      <ShippingSection user={user} />
    </div>
  );
}
