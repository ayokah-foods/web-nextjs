"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatHumanReadableDate } from "@/utils/formatDate";
import { OrderResponse } from "@/interfaces/orders";
import { listOrders } from "@/lib/api/orders";
import TanStackTable from "@/app/(seller)/dashboard/components/commons/TanStackTable";
import { ColumnDef } from "@tanstack/react-table";
import StatusBadge from "@/utils/StatusBadge";
import { FaExternalLinkAlt } from "react-icons/fa";

interface RecentOrdersTableProps {
    limit: number;   
    status?: string;
}

const RecentOrdersTable: React.FC<RecentOrdersTableProps> = ({ limit }) => {
    const [orders, setOrders] = useState<OrderResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const columns: ColumnDef<OrderResponse>[] = useMemo(
        () => [
            {
                header: "Customer",
                accessorKey: "user",
                cell: ({ getValue }) => {
                    const value = getValue() as { name: string; photo: string } | null;
                    return (
                      <div className="flex items-center space-x-2">
                        <Image
                          width={50}
                          height={50}
                          src={value?.photo || "/default-avatar.png"}
                          alt={value?.name || "User"}
                          priority
                        />
                        <span>{value?.name ?? "N/A"}</span>
                      </div>
                    );
                },
            },
            {
                header: "Item",
                accessorKey: "product",
                cell: ({ getValue }) => {
                    const value = getValue() as { title: string; image: string } | null;
                    return (
                        <div className="flex items-center space-x-2">
                            <Image
                                src={value?.image || ""}
                                alt={value?.title || "Product"}
                                width={40}
                                height={40}
                                className="w-10 h-10 object-cover rounded"
                            />
                            <span>{value?.title ?? "N/A"}</span>
                        </div>
                    );
                },
            },
            {
                header: "Subtotal",
                accessorKey: "subtotal",
                cell: ({ getValue }) => {
                    const value = getValue() as string;
                    const numericValue = parseFloat(value);
                    return isNaN(numericValue)
                        ? "Invalid"
                        : `$${numericValue.toFixed(2)}`;
                },
            },
            {
                header: "Quantity",
                accessorKey: "quantity",
            },
            {
                header: "Shipping",
                accessorKey: "shipping_status",
                cell: ({ getValue }) => {
                    const value = String(getValue() ?? "N/A");
                    return <StatusBadge status={value} />;
                },
            },
            {
                header: "Payment",
                accessorKey: "payment_status",
                cell: ({ getValue }) => {
                    const value = String(getValue() ?? "N/A");
                    return <StatusBadge status={value} type="payment" />;
                },
            },
            {
                header: "Action",
                accessorKey: "id",
                cell: ({ getValue }) => {
                    const orderId = getValue();
                    return (
                        <button
                            className="px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700 cursor-pointer"
                            onClick={() => {
                                window.location.href = `/orders/${orderId}`;
                            }}
                        >
                            View Order
                        </button>
                    );
                },
            },
            {
                header: "Date",
                accessorKey: "created_at",
                cell: ({ getValue }) => {
                    const value = getValue() as string;
                    return formatHumanReadableDate(value);
                },
            },
        ],
        []
    );

    const fetchOrders = useCallback(async () => {
        try {
            setLoading(true);
            const response = await listOrders(limit, 0);  
            setOrders(response.data);
        } catch (err) {
            console.error(err);
            setError("An error occurred while fetching orders.");
        } finally {
            setLoading(false);
        }
    }, [limit]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    return (
      <>
        <div className="card flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Recent orders</h2>
          <Link
            href="/orders"
            className="text-sm btn btn-gray flex items-center"
          >
            See all <FaExternalLinkAlt className="ml-2" />
          </Link>
        </div>
        <div>
          <TanStackTable
            data={orders}
            columns={columns}
            loading={loading}
            error={error}
          />
        </div>
      </>
    );
};

export default RecentOrdersTable;
