"use client";

import { listOrders } from "@/lib/api/orders";
import { debounce } from "lodash";
import { useState, useCallback, useMemo, useEffect } from "react";
import { FiPackage } from "react-icons/fi";
import { SkeletonOrderCard } from "./components/SkeletonOrderCard";
import { CustomerOrder, CustomerOrdersResponse } from "@/interfaces/orders";
import { formatAmount } from "@/utils/formatCurrency";
import { formatHumanReadableDate } from "@/utils/formatDate";
import Link from "next/link";
import Image from "next/image";
import StatusBadge from "@/utils/StatusBadge";

export default function Orders() {
  const PAGE_SIZE = 2;

  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>("");
  const [offset, setOffset] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);

  const fetchOrders = useCallback(
    async (offsetValue: number, searchValue: string, isLoadMore = false) => {
      try {
        if (!isLoadMore) setLoading(true);

        const response: CustomerOrdersResponse = await listOrders(
          PAGE_SIZE,
          offsetValue,
          searchValue
        );

        if (isLoadMore) {
          setOrders((prev) => [...prev, ...response.data]);
        } else {
          setOrders(response.data);
        }

        setTotalOrders(response.total);
      } catch (err) {
        console.error(err);
        setError("An error occurred while fetching orders.");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    []
  );

  const debouncedFetch = useMemo(
    () =>
      debounce((off, srch) => {
        fetchOrders(off, srch);
      }, 300),
    [fetchOrders]
  );

  useEffect(() => {
    setOffset(0);
    debouncedFetch(0, search);
    return () => debouncedFetch.cancel();
  }, [search]);

  const handleLoadMore = async () => {
    const newOffset = offset + PAGE_SIZE;
    setOffset(newOffset);
    setLoadingMore(true);

    await fetchOrders(newOffset, search, true);
  };

  return (
    <div>
      <div className="card mb-6">
        <h2 className="text-lg font-semibold flex items-center">
          <FiPackage className="text-orange-800 text-xl mr-2" size={24} />
          Orders
        </h2>
        <p className="text-sm mt-1 text-gray-600">
          From your account, you can easily manage your recent
          <span className="text-orange-800"> orders </span>
        </p>
      </div>

      {/* Search */}
      <div className="mb-4" hidden>
        <input
          type="text"
          placeholder="Search orders by product name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-orange-200 rounded-lg px-3 py-2 w-full focus:outline-none"
        />
      </div>

      {/* Loading (Initial) */}
      {loading && orders.length === 0 ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <SkeletonOrderCard key={i} />
          ))}
        </div>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-500">No orders found.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="card">
              {/* Header */}
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-gray-800">
                  Order #{order.id}
                </h3>

                <StatusBadge status={order.shipping_status} type="shipping" />

                <Link
                  prefetch={true}
                  href={`/account/orders/${order.id}`}
                  className="btn btn-gray text-xs"
                >
                  View detail
                </Link>
              </div>

              {/* Meta */}
              <div className="mt-2 text-sm space-y-1">
                <p>
                  Total: <strong>{formatAmount(order.total)}</strong>
                </p>
                <p>Payment: {order.payment_status}</p>

                {order.delivery_date && (
                  <p>
                    Delivery: {formatHumanReadableDate(order.delivery_date)}
                  </p>
                )}

                {order.shipping_fee && (
                  <p>Shipping Fee: {formatAmount(order.shipping_fee)}</p>
                )}

                {order.tracking_number && (
                  <p>
                    Tracking:{" "}
                    {order.tracking_url ? (
                      <a
                        href={order.tracking_url}
                        target="_blank"
                        className="text-blue-600 underline"
                      >
                        {order.tracking_number}
                      </a>
                    ) : (
                      order.tracking_number
                    )}
                  </p>
                )}
              </div>

              {/* Items */}
              <div className="mt-4 border-t border-orange-200 pt-4 space-y-4">
                {order.order_items.map((item) => (
                  <Link
                    key={item.id}
                    href={`/items/${item.product.slug}`}
                    prefetch={true}
                  >
                    <div className="flex items-center gap-4">
                      <Image
                        width={64}
                        height={64}
                        alt="product image"
                        src={item.product.images[0]}
                        className="w-16 h-16 rounded object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-medium">{item.product.title}</p>
                        <p className="text-sm text-gray-600">
                          Qty: {item.quantity} • {formatAmount(item.subtotal)}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}

          {/* LOAD MORE */}
          {orders.length < totalOrders && (
            <div className="flex justify-center mt-6">
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="btn btn-primary  w-full sm:w-1/2"
              >
                {loadingMore ? "Loading..." : "Load More"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
