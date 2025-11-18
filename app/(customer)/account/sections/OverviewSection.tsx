"use client";

import { useAuthStore } from "@/store/useAuthStore";

export default function OverviewSection() {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="space-y-6">
      {/* Welcome Box */}
      <div className="card">
        <h2 className="text-lg font-semibold">
          Hello, {user?.name ?? "Guest"}
        </h2>

        <p className="text-sm mt-1 text-gray-600">
          From here you can manage your profile, view recent orders, update
          addresses, and more.
        </p>
      </div>

      {/* Order History */}
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
