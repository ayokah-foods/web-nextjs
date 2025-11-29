"use client";

import { useEffect, useState } from "react";
import {
  getVendorBank,
  getVendorEarnings,
  getVendorEarningsGraph,
} from "@/lib/api/seller/earnings";
import { LuMessageCircle } from "react-icons/lu";
import { formatAmount } from "@/utils/formatCurrency";
import WalletCard from "./components/WalletCard";

interface Earnings {
  id: number;
  user_id: number;
  total_earning: string;
  available_to_withdraw: string;
  pending: number;
}

export default function FinancePaymentPage() {
  const [wallet, setWallet] = useState<Earnings | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  /** FETCH WALLET + BANK + GRAPH */
  async function fetchFinance() {
    try {
      setLoading(true);

      const earnings = await getVendorEarnings();
      // const earningGraph = await getVendorEarningsGraph(); // will use later
      // const settlementBank = await getVendorBank();        // will use later

      setWallet(earnings?.data || null);
    } catch (err) {
      console.error("Error loading finance data:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchFinance();
  }, []);

  return (
    <div>
      {/* HEADER CARD */}
      <div className="card mb-6 hover:shadow-lg transition-all duration-300 rounded-xl bg-white cursor-default p-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold flex items-center gap-2 text-orange-800">
            <LuMessageCircle /> Finance & Payments
          </h2>
        </div>
        <p className="text-sm mt-1 text-gray-600">
          From your dashboard, you can manage your sales, payouts, and bank
          settlements.
        </p>
      </div>

      <WalletCard
        wallet={wallet}
        loading={loading} 
      />
    </div>
  );
}
