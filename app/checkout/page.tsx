"use client";

import { useState, useMemo } from "react";
import { useCart } from "@/context/CartContext";
import OrderSummary from "../carts/components/Summary";
import AddressAutocomplete from "./components/AddressAutocomplete";
import Address from "@/interfaces/address";
import { shippingRate } from "@/lib/api/shippingRate";
import toast from "react-hot-toast";
import axios, { AxiosError } from "axios";
import { ShippingRateResponse } from "@/interfaces/shippingRate";

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const [userIP] = useState<string>("178.238.11.6");
  const [loading, setLoading] = useState(false);
  const [shippingRates, setShippingRates] =
    useState<ShippingRateResponse | null>(null);
const [shippingFee, setShippingFee] = useState(0);

  const [address, setAddress] = useState<Address>({
    street_address: "",
    city: "",
    state: "",
    zip_code: "",
    phone: "",
    address_label: "",
    country: "",
  });

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [serviceNote, setServiceNote] = useState("");
  const [preferredDate, setPreferredDate] = useState("");

  const isServiceOrder = useMemo(() => {
    return cart.some((item) => item.type === "services");
  }, [cart]);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const total = subtotal;

  const handleAddressChange = (field: keyof Address, value: string) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const basePayload = {
      firstname,
      lastname,
      email,
      phone,
      country: address.country || "UK",
      ip: userIP,
      products: cart.map((item) => ({
        id: item.id,
        quantity: item.qty,
      })),
    };

    const payload = isServiceOrder
      ? {
          ...basePayload,
          note: serviceNote,
          preferred_date: preferredDate,
          type: "services",
        }
      : {
          ...basePayload,
          street: address.street_address,
          city: address.city,
          state: address.state,
          zip: address.zip_code,
          type: "products",
        };

    try {
      setLoading(true);
      const response = await shippingRate(payload);
      console.log(response);
      if (response?.rate) {
        setShippingRates(response.rate);
      }
    } catch (err) {
      let message = "An error occurred while saving the item";
      if (axios.isAxiosError(err)) {
        const axiosErr = err as AxiosError<{ message: string }>;
        message = axiosErr.response?.data?.message ?? axiosErr.message;
      }
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50  py-8">
      <div className="px-4 lg:px-8 flex flex-col lg:flex-row gap-8">
        {/* Checkout Form */}
        <div className="flex-1 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            {isServiceOrder
              ? "Service Booking Information"
              : "Shipping Information"}
          </h2>

          <form
            className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-500!"
            onSubmit={handleSubmit}
          >
            {/* Customer Info */}
            <input
              type="text"
              placeholder="First Name"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              required
              className="input"
            />
            <input
              type="text"
              placeholder="Last Name"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              required
              className="input"
            />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input"
            />
            <input
              type="text"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="input"
            />

            {/* 👇 Conditional Fields */}
            {!isServiceOrder ? (
              <>
                <div className="md:col-span-2">
                  <AddressAutocomplete
                    onSelectAddress={(addr) =>
                      setAddress((prev) => ({ ...prev, ...addr }))
                    }
                  />
                </div>
                <input
                  type="text"
                  placeholder="Street Address"
                  value={address.street_address}
                  onChange={(e) =>
                    handleAddressChange("street_address", e.target.value)
                  }
                  className="input"
                />
                <input
                  type="text"
                  placeholder="City"
                  value={address.city}
                  onChange={(e) => handleAddressChange("city", e.target.value)}
                  className="input"
                />
                <input
                  type="text"
                  placeholder="State"
                  value={address.state}
                  onChange={(e) => handleAddressChange("state", e.target.value)}
                  className="input"
                />
                <input
                  type="text"
                  placeholder="Zip Code"
                  value={address.zip_code}
                  onChange={(e) =>
                    handleAddressChange("zip_code", e.target.value)
                  }
                  className="input"
                />
                <input
                  type="text"
                  placeholder="Zip Code"
                  value={address.country}
                  onChange={(e) =>
                    handleAddressChange("country", e.target.value)
                  }
                  className="input"
                />
              </>
            ) : (
              <>
                <textarea
                  placeholder="Describe your service needs or special instructions..."
                  value={serviceNote}
                  onChange={(e) => setServiceNote(e.target.value)}
                  rows={4}
                  className="border border-gray-200 p-3 rounded md:col-span-2 focus:ring-orange-800 focus:border-orange-800 focus:outline-none transition duration-150"
                  required
                />
                <input
                  type="datetime-local"
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="border border-gray-200 p-3 rounded md:col-span-2 focus:ring-orange-800 focus:border-orange-800 focus:outline-none transition duration-150"
                  required
                />
              </>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`mt-2 w-full py-3 rounded-full font-medium md:col-span-2 transition ${
                loading ? "btn btn-gray" : "btn btn-primary"
              }`}
            >
              {loading
                ? "Processing..."
                : isServiceOrder
                ? "Book Service"
                : "Proceed to Shipping"}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <OrderSummary
          cart={cart}
          subtotal={subtotal}
          shippingRates={shippingRates}
          onSelectRate={(fee) => setShippingFee(fee)}
          shippingFee={shippingFee}
        />
      </div>
    </div>
  );
}
