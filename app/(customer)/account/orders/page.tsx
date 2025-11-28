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
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>("");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });
  const [totalOrders, setTotalOrders] = useState(0);

  const fetchOrders = useCallback(
    async (pageIndex: number, search: string) => {
      try {
        setLoading(true);
        const offset = pageIndex * pagination.pageSize;

        const response: CustomerOrdersResponse = await listOrders(
          pagination.pageSize,
          offset,
          search
        );
        setOrders(response.data);
        setTotalOrders(response.total);
      } catch (err) {
        console.error(err);
        setError("An error occurred while fetching orders.");
      } finally {
        setLoading(false);
      }
    },
    [pagination.pageSize]
  );

  const debouncedFetchOrders = useMemo(
    () =>
      debounce((pageIndex: number, search: string) => {
        fetchOrders(pageIndex, search);
      }, 300),
    [fetchOrders]
  );

  useEffect(() => {
    debouncedFetchOrders(pagination.pageIndex, search);
    return () => {
      debouncedFetchOrders.cancel();
    };
  }, [pagination.pageIndex, debouncedFetchOrders, search]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
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
          onChange={handleSearchChange}
          className="border border-orange-200 rounded-lg px-3 py-2 w-full focus:outline-none"
        />
      </div>

      {/* Loading state */}
      {loading ? (
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
              {/* Order Header */}
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-gray-800">
                  Order #{order.id}
                </h3>
                <span className="px-2 py-1 rounded text-xs ">
                  <StatusBadge status={order.shipping_status} type="shipping" />
                </span>
                <span className="btn btn-gray">
                  <Link target="_blank" href={`/account/orders/${order.id}`}>View detail</Link>
                </span>
              </div>

              {/* Order Meta */}
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

              {/* Order Items */}
              <div className="mt-4 border-t border-orange-200 pt-4 space-y-4">
                {order.order_items.map((item) => (
                  <Link target="_blank" href={`/items/${item.product.slug}`}>
                    <div key={item.id} className="flex items-center gap-4">
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
        </div>
      )}

      {/* Fancy Pagination */}
      {!loading && totalOrders > pagination.pageSize && (
        <div className="flex justify-center mt-6">
          <div className="flex items-center gap-2">
            {/* Previous */}
            <button
              disabled={pagination.pageIndex === 0}
              onClick={() =>
                setPagination((prev) => ({
                  ...prev,
                  pageIndex: prev.pageIndex - 1,
                }))
              }
              className={`btn btn-gray ${
                pagination.pageIndex === 0
                  ? "opacity-40 cursor-not-allowed"
                  : "hover:bg-gray-100"
              }`}
            >
              Prev
            </button>

            {/* Page numbers */}
            {Array.from(
              { length: Math.ceil(totalOrders / pagination.pageSize) },
              (_, i) => (
                <button
                  key={i}
                  onClick={() =>
                    setPagination((prev) => ({
                      ...prev,
                      pageIndex: i,
                    }))
                  }
                  className={`px-3 py-2 rounded-md border border-gray-200 ${
                    pagination.pageIndex === i
                      ? "bg-orange-800 text-white"
                      : "hover:bg-gray-100 cursor-pointer"
                  }`}
                >
                  {i + 1}
                </button>
              )
            )}

            {/* Next */}
            <button
              disabled={
                (pagination.pageIndex + 1) * pagination.pageSize >= totalOrders
              }
              onClick={() =>
                setPagination((prev) => ({
                  ...prev,
                  pageIndex: prev.pageIndex + 1,
                }))
              }
              className={`btn btn-gray ${
                (pagination.pageIndex + 1) * pagination.pageSize >= totalOrders
                  ? "opacity-40 cursor-not-allowed"
                  : "hover:bg-gray-100"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
