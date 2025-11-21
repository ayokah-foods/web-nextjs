"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import Image from "next/image";
import { ColumnDef } from "@tanstack/react-table";
import { debounce } from "lodash";
import StatusBadge from "@/utils/StatusBadge";
import { 
  EyeIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import { Product } from "@/interfaces/products";
import { formatHumanReadableDate } from "@/utils/formatDate";
import TanStackTable from "../../dashboard/components/commons/TanStackTable";
import { listSellerItems, updateItemStatus } from "@/lib/api/items";
import SelectDropdown from "../../dashboard/components/commons/Fields/SelectDropdown";
import { getStockBadgeClass } from "@/utils/StockBadge";

interface ProductTableProps {
  limit: number;
  offset: number;
  status: string;
}
type Option = { label: string; value: string };

const statusOptions: Option[] = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

function ProductActionCell({
  productId,
  initialStatus,
  onStatusUpdate,
}: {
  productId: number;
  initialStatus: string;
  onStatusUpdate: (newStatus: string) => void;
}) {
  const [status, setStatus] = useState<Option>(
    statusOptions.find((opt) => opt.value === initialStatus) || statusOptions[0]
  );

  const handleStatusChange = async (selected: Option) => {
    const previous = status;
    setStatus(selected);
    try {
      await updateItemStatus(productId, selected.value);
      toast.success("Status updated");
      onStatusUpdate(selected.value);
    } catch {
      setStatus(previous);
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <SelectDropdown
        value={status}
        options={statusOptions}
        onChange={handleStatusChange}
      />
    </div>
  );
}

const ItemsTable: React.FC<ProductTableProps> = ({ limit, offset, status }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>("");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: limit,
  });
  const [totalProducts, setTotalProducts] = useState(0);

  const updateProductStatusInState = (
    id: number,
    newStatus: "active" | "inactive"
  ) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
    );
  };

  const columns: ColumnDef<Product>[] = useMemo(
    () => [
      {
        header: "Item",
        accessorKey: "title",
        cell: ({ row }) => {
          const image = row.original.images?.[0];
          const title = row.original.title;
          const category = row.original.category?.name;

          return (
            <div className="flex items-center space-x-2">
              <Image
                src={image || "/placeholder.png"}
                alt={title}
                width={40}
                height={40}
                className="w-10 h-10 object-cover rounded"
              />
              <div className="flex flex-col">
                <span className="font-medium text-gray-800">{title}</span>
                {category && (
                  <span className="text-xs text-gray-500">{category}</span>
                )}
              </div>
            </div>
          );
        },
      },
      {
        header: "Avg. Rating",
        accessorKey: "average_rating",
        cell: ({ getValue }) => {
          const rating = parseFloat(getValue() as string) || 0;
          const stars = Math.round(rating);

          return (
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, index) => (
                <StarIcon
                  key={index}
                  className={`w-4 h-4 ${
                    index < stars ? "text-yellow-500" : "text-gray-300"
                  }`}
                />
              ))}
              <span className="ml-2 text-sm text-gray-600">
                {rating.toFixed(1)}
              </span>
            </div>
          );
        },
      },
      {
        header: "Price",
        cell: ({ row }) => {
          const salesPrice = parseFloat(row.original.sales_price || "0");
          const regularPrice = parseFloat(row.original.regular_price || "0");

          const formattedSales = `$${salesPrice.toFixed(2)}`;
          const formattedRegular = `$${regularPrice.toFixed(2)}`;

          return (
            <div className="flex flex-col text-xs">
              <span className="text-gray-800 font-semibold">
                {formattedSales}
              </span>
              {salesPrice > 0 &&
                regularPrice > 0 &&
                salesPrice < regularPrice && (
                  <span className="text-gray-500 line-through text-xs">
                    {formattedRegular}
                  </span>
                )}
            </div>
          );
        },
      },

      {
        header: "Stock",
        accessorKey: "quantity",
        cell: ({ getValue }) => {
          const quantity = getValue() as number;
          const max = 100;
          const stock = getStockBadgeClass(quantity, max);
          return (
            <span
              className={`px-2 py-0.5 text-xs font-medium rounded-full ${stock.class}`}
            >
              {quantity} • {stock.level}
            </span>
          );
        },
      },
      {
        header: "Views",
        accessorKey: "views",
        cell: ({ getValue }) => {
          const views = getValue() as number;

          return (
            <div className="flex items-center gap-1 text-gray-700">
              <EyeIcon className="w-4 h-4 text-amber-600" />
              <span>{views}</span>
            </div>
          );
        },
      },

      {
        header: "Status",
        accessorKey: "status",
        cell: ({ getValue }) => {
          const status = String(getValue() || "").toLowerCase();
          return <StatusBadge status={status} />;
        },
      },
      {
        header: "Created At",
        accessorKey: "created_at",
        cell: ({ getValue }) => {
          const value = getValue() as string;
          return formatHumanReadableDate(value);
        },
      },
      {
        header: "Action",
        accessorKey: "id",
        cell: ({ row }) => (
          <ProductActionCell
            productId={row.original.id}
            initialStatus={row.original.status}
            onStatusUpdate={(newStatus) =>
              updateProductStatusInState(
                row.original.id,
                newStatus as "active" | "inactive"
              )
            }
          />
        ),
      },
    ],
    []
  );

  const fetchProducts = useCallback(
    async (pageIndex: number, search: string = "") => {
      try {
        setLoading(true);
        const offset = pageIndex * pagination.pageSize;
        const response = await listSellerItems(
          pagination.pageSize,
          offset,
          search
        );
        setProducts(response.data);
        setTotalProducts(response.total || 0);
      } catch (err) {
        console.error(err);
        setError("An error occurred while fetching products.");
      } finally {
        setLoading(false);
      }
    },
    [pagination.pageSize, offset, status]
  );

  const debouncedFetchProducts = useMemo(() => {
    return debounce((pageIndex: number, search: string) => {
      fetchProducts(pageIndex, search);
    }, 300);
  }, [fetchProducts]);

  useEffect(() => {
    debouncedFetchProducts(pagination.pageIndex, search);
    return () => {
      debouncedFetchProducts.cancel();
    };
  }, [pagination.pageIndex, debouncedFetchProducts, search]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  return (
    <div className="space-y-6">
      <div className="mb-4 mt-8">
        <input
          type="text"
          placeholder="Search by product name..."
          value={search}
          onChange={handleSearchChange}
          className="w-full px-3 py-2 border rounded-md border-amber-600 text-gray-900 focus:outline-none"
        />
      </div>

      <TanStackTable
        data={products}
        columns={columns}
        loading={loading}
        error={error}
        pagination={{
          pageIndex: pagination.pageIndex,
          pageSize: pagination.pageSize,
          totalRows: totalProducts,
        }}
        onPaginationChange={(updatedPagination) => {
          setPagination({
            pageIndex: updatedPagination.pageIndex,
            pageSize: updatedPagination.pageSize,
          });
        }}
      />
    </div>
  );
};

export default ItemsTable;
