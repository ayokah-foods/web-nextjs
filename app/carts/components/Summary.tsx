"use client";

import { useState } from "react";
import { RateOption, ShippingRateResponse } from "@/interfaces/shippingRate";
import { formatAmount } from "@/utils/formatCurrency";
import Image from "next/image";
import { carrierIcons } from "@/setting";
import { formatHumanReadableDate } from "@/utils/formatDate";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/useAuthStore";
import axios from "axios";
import { CheckoutPayload, checkoutStripe } from "@/lib/api/checkout";

export default function OrderSummary({
  cart,
  subtotal,
  shippingRates,
  onSelectRate,
  shippingFee,
}: {
  cart: any[];
  subtotal: number;
  shippingRates: ShippingRateResponse | null;
  onSelectRate: (fee: number) => void;
  shippingFee: number;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [selectedShipping, setSelectedShipping] = useState<RateOption | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const { user } = useAuthStore(); // get logged-in user

  const handlePick = (key: "cheapest" | "fastest", option: RateOption) => {
    setSelected(key);
    onSelectRate(option.total);
    setSelectedShipping(option);
  };
  const handleCheckout = async () => {
    if (!shippingFee || !selectedShipping) {
      return toast.error("Please select a shipping option before checkout");
    }
    const sessionEmail = sessionStorage.getItem("checkout_email");

  const payload: CheckoutPayload = {
    email: user?.email || sessionEmail!,
    products: cart.map((item) => ({
      id: item.id,
      quantity: item.qty,
    })),
    shipping_fee: shippingFee,
    shipping_carrier: selectedShipping.carrier,
    estimated_delivery: selectedShipping.estimated_delivery,
  };

  try {
    setLoading(true);
    const response = await checkoutStripe(payload);
    console.log(response.url)
    if (response.url) {
      sessionStorage.removeItem("checkout_email");
      window.location.href = response.url;
    }
  } catch (err) {
    const message = axios.isAxiosError(err)
      ? err.response?.data?.message ?? err.message
      : "An error occurred during checkout";
    toast.error(message);
  } finally {
    setLoading(false);
  }
  };

  return (
    <div className="w-full lg:w-96 bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4 text-gray-700">
        Order Summary
      </h3>

      {/* 🛒 CART ITEMS SECTION (RESTORED) */}
      <div className="space-y-4 max-h-60 overflow-y-auto border-b pb-4">
        {cart.map((item) => (
          <div key={item.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image
                src={item.image}
                alt={item.title}
                width={50}
                height={50}
                className="rounded-md object-cover"
              />
              <div>
                <p className="text-sm text-gray-700">{item.title}</p>
                <p className="text-xs text-gray-400">x{item.qty}</p>
              </div>
            </div>

            <span className="text-sm font-medium text-gray-800">
              {formatAmount(item.price * item.qty)}
            </span>
          </div>
        ))}
      </div>

      {/* Subtotal */}
      <div className="flex justify-between py-3 text-gray-600">
        <span>Subtotal</span>
        <span>{formatAmount(subtotal)}</span>
      </div>

      {/* 🚚 SHIPPING OPTIONS */}
      {shippingRates && (
        <div className="mt-4 space-y-3">
          {(["cheapest", "fastest"] as const).map((key) => {
            const r = shippingRates[key];
            if (!r) return null;

            const active = selected === key;
            const carrier = r.carrier.toLowerCase();
            const { icon: CarrierIcon, color } =
              carrierIcons[carrier] || carrierIcons["default"];

            return (
              <div
                key={key}
                onClick={() => handlePick(key, r)}
                className={`flex gap-4 items-center p-4 rounded-lg border cursor-pointer transition
                  ${
                    active
                      ? "border-orange-800 bg-blue-50 scale-[1.02]"
                      : "border-gray-200 hover:border-gray-400 hover:scale-[1.01]"
                  }
                `}
              >
                <CarrierIcon
                  className="w-10 h-10 transition-transform duration-150"
                  style={{ color }}
                />

                <div className="flex-1">
                  <p className="font-semibold text-gray-700 capitalize">
                    {key}
                  </p>
                  <p className="text-sm text-gray-500">
                    {r.delivery_days} {r.delivery_days === 1 ? "day" : "days"}{" "}
                    delivery
                  </p>
                  <p className="text-sm text-gray-500">
                    {/* Arrives: {new Date(r.estimated_delivery).toDateString()} */}
                    Arrives: {formatHumanReadableDate(r.estimated_delivery)}
                  </p>
                </div>

                <div className="text-right font-semibold text-gray-700">
                  {formatAmount(r.total)}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Total */}
      <div className="flex justify-between mt-6 pt-4 border-t border-orange-800 text-lg font-semibold text-gray-800">
        <span>Total</span>

        <span>
          {shippingFee > 0
            ? formatAmount(subtotal + shippingFee)
            : "Select a shipping option"}
        </span>
      </div>
      {shippingFee > 0 && (
        <button
          onClick={handleCheckout}
          disabled={!shippingFee || !selectedShipping || loading}
          className="mt-4 w-full py-3 rounded-full font-medium btn btn-primary"
        >
          {loading ? "Processing..." : "Checkout to Payment"}
        </button>
      )}
    </div>
  );
}
