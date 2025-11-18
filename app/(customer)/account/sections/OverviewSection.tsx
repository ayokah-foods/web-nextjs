"use client";

import { useMemo } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import Image from "next/image";

export default function OverviewSection() {
  const user = useAuthStore((state) => state.user);

  // compute greeting based on UK time
  const greeting = useMemo(() => {
    const ukTime = new Date().toLocaleString("en-GB", {
      timeZone: "Europe/London",
    });

    const hour = new Date(ukTime).getHours();

    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  }, []);

  return (
    <div className="space-y-6">
      {/* Welcome Box */}
      <div className="card">
        <h2 className="text-lg font-semibold">
          {greeting}, {user?.name ?? "Guest"}
        </h2>

        <p className="text-sm mt-1 text-gray-600">
          From your account dashboard, you can easily check & view your
          <span className="text-orange-500"> Recent Orders</span>, manage your
          <span className="text-orange-500">
            {" "}
            Shipping and Billing Addresses
          </span>
          , and edit your <span className="text-orange-500">Password</span> and
          <span className="text-orange-500"> Account Details</span>.
        </p>
      </div>

      {/* --- Two Cards Section --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Card */}
        <div className="card flex flex-col items-center text-center py-6">
          <Image
            src={user?.profile_photo || "/default-avatar.png"}
            width={80}
            height={80}
            alt="Profile"
            className="rounded-full"
          />

          <h3 className="mt-4 font-semibold text-lg">
            {user?.name} {user?.last_name ?? "Guest"}
          </h3>
          <p className="text-gray-500 text-sm">{user?.role ?? "Customer"}</p>

          <button className="mt-3 text-orange-500 hover:underline">
            Edit Profile
          </button>
        </div>

        {/* Shipping Address Card */}
        <div className="card p-6">
          <h4 className="text-sm text-gray-500 mb-3">Shipping Address</h4>

          <div className="space-y-1">
            <p className="font-semibold">
              {user?.name} {user?.last_name ?? "Guest"}
            </p>
            <p className="text-gray-700 text-sm">
              {user?.city ?? "No address added yet."},{" "}
              {user?.state ?? "No address added yet."},{" "}
              {user?.country ?? "No address added yet."}
            </p>

            <p className="text-gray-700 text-sm">{user?.email}</p>
            <p className="text-gray-700 text-sm">
              {user?.phone ?? "(no phone number)"}
            </p>
          </div>

          <button className="mt-3 text-orange-500 hover:underline">
            Edit Address
          </button>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="card">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold">Recent Order History</h3>
          <a className="text-sm text-orange-500 hover:underline">
            See all orders
          </a>
        </div>

        <div className="text-sm text-gray-700">No recent orders.</div>
      </div>
    </div>
  );
}
