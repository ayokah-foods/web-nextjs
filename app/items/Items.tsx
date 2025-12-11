"use client";

import { useEffect, useState, FC, useMemo } from "react";
import Image from "next/image";
import { ShoppingBagIcon } from "@heroicons/react/24/outline";
import Product, { Category } from "@/interfaces/items";
import { useRouter, useSearchParams } from "next/navigation";
import Skeleton from "react-loading-skeleton";
import { listItems } from "@/lib/api/items";
import debounce from "lodash.debounce";
import { formatAmount } from "@/utils/formatCurrency";
import CubeIcon from "@heroicons/react/24/solid/CubeIcon";

interface ItemsProps {
  params: { slug: string };
}

interface ApiResponse {
  status: string;
  message: string;
  category_info: Category | null;
  data: Product[];
  total: number;
  offset: number;
  limit: number;
  stats: Record<string, number>;
}

const Items: FC<ItemsProps> = ({}) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const queryType = searchParams.get("type") || "products";
  const queryCategory = searchParams.get("category") || "";

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryInfo, setCategoryInfo] = useState<Category | null>(null);
  const [total, setTotal] = useState(0);

  const [filters, setFilters] = useState<{
    limit: number;
    offset: number;
    search: string;
    type: string;
    status: string;
    category: string;
    sort: "asc" | "desc";
    availability?: string;
    rating?: number;
  }>({
    limit: 15,
    offset: 0,
    search: "",
    type: queryType,
    status: "active",
    category: queryCategory,
    sort: "asc",
    availability: undefined,
    rating: undefined,
  });

  // Fetch products
  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);

        const params = {
          limit: filters.limit,
          offset: filters.offset,
          search: filters.search || undefined,
          type: filters.type,
          status: filters.status,
          category: filters.category || undefined,
          direction: filters.sort,
          availability: filters.availability,
        };

        const res: ApiResponse = await listItems(params);

        setProducts(res.data || []);
        setCategoryInfo(res.category_info || null);
        setTotal(res.total || 0);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [filters]);

  // Update filters when query params change
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      type: queryType,
      category: queryCategory,
      offset: 0, // reset offset on filter change
    }));
  }, [queryType, queryCategory]);

  // debounce search updates by 500ms
  const debouncedSetSearch = useMemo(
    () =>
      debounce((value: string) => {
        setFilters((prev) => ({ ...prev, search: value, offset: 0 }));
      }, 500),
    []
  );

  useEffect(() => {
    return () => {
      debouncedSetSearch.cancel();
    };
  }, [debouncedSetSearch]);

  const totalPages = Math.ceil(total / filters.limit);
  const currentPage = Math.floor(filters.offset / filters.limit) + 1;

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setFilters((prev) => ({ ...prev, offset: (newPage - 1) * prev.limit }));
  };

  const renderSkeletons = () =>
    Array.from({ length: filters.limit }).map((_, idx) => (
      <div
        key={idx}
        className="bg-white rounded-xl overflow-hidden shadow relative"
      >
        <Skeleton height={224} className="w-full h-56" />
        <div className="p-3">
          <Skeleton width={80} height={16} className="mb-2" />
          <Skeleton height={16} className="mb-2" />
          <Skeleton height={16} width={60} />
        </div>
      </div>
    ));

  return (
    <div className="p-4 bg-white">
      {/* Category Header */}
      {loading ? (
        <div className="mb-6 bg-white p-6 rounded-lg shadow-md">
          <Skeleton circle width={144} height={144} className="mb-4" />
          <Skeleton height={36} width={250} className="mb-2" />
          <Skeleton count={2} />
        </div>
      ) : (
        categoryInfo && (
          <div className="mb-6 bg-white p-6 rounded-lg shadow-md flex flex-col md:flex-row items-center gap-6">
            {categoryInfo.image && (
              <Image
                src={categoryInfo.image}
                alt={categoryInfo.name}
                width={150}
                height={150}
                className="w-36 h-36 rounded-full object-cover border-4 border-orange-100 shrink-0"
              />
            )}
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {categoryInfo.name}
              </h1>
              <div
                className="text-gray-600 prose"
                dangerouslySetInnerHTML={{ __html: categoryInfo.description }}
              />
            </div>
          </div>
        )
      )}

      {/* Product Grid */}
      <main className="col-span-12 lg:col-span-9">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {loading ? (
            renderSkeletons()
          ) : products.length > 0 ? (
            products.map((product) => (
              <div
                onClick={() => router.push(`/items/${product.slug}`)}
                key={product.id}
                className="bg-white rounded-xl overflow-hidden shadow relative group cursor-pointer"
              >
                <div className="relative">
                  <Image
                    src={product.images[0] || "/placeholder.png"}
                    alt={product.title}
                    width={400}
                    height={400}
                    className="w-full h-56 object-cover"
                  />
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition">
                    <button className="bg-white rounded-full p-2 shadow hover:bg-orange-100">
                      <ShoppingBagIcon className="w-5 h-5 text-black cursor-pointer" />
                    </button>
                  </div>
                </div>

                <div className="p-3">
                  <div className="flex items-center gap-1 text-yellow-400 mb-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i}>
                        {i < product.average_rating ? "★" : "☆"}
                      </span>
                    ))}
                  </div>

                  <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-1">
                    {product.title}
                  </h3>

                  <p className="text-sm font-semibold text-gray-800">
                    {formatAmount(product.sales_price)}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-10 flex flex-col items-center justify-center gap-4 h-screen">
              <CubeIcon className="w-16 h-16 text-gray-300 animate-pulse" />
              <p className="text-gray-500 text-lg font-semibold">
                No items available.
              </p>
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-6">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="btn btn-gray"
            >
              Previous
            </button>
            <span className="text-yellow-800">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="btn btn-gray"
            >
              Next
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Items;
