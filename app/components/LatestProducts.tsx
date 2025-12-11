"use client";

import { useEffect, useState, FC } from "react";
import Image from "next/image";
import {
  ShoppingBagIcon,
  HeartIcon,
  ArrowRightCircleIcon,
} from "@heroicons/react/24/outline";
import { listItems } from "@/lib/api/items";
import Item from "@/interfaces/items";
import { useRouter } from "next/navigation";
import Skeleton from "react-loading-skeleton";
import { formatAmount } from "@/utils/formatCurrency";

const LatestProducts: FC = () => {
  const [products, setProducts] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        const res = await listItems({
          limit: 12,
          offset: 0,
          type: "products",
          status: "active",
          direction: "asc", // or "desc"
        });

        const allProducts = Array.isArray(res.data) ? res.data : [];
        setProducts(allProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const renderSkeletons = () =>
    Array.from({ length: 12 }).map((_, idx) => (
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
    <section className="mb-4">
      <div className="max-w-full mx-auto px-4 md:px-6 lg:px-8 pb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl md:text-xl font-bold text-orange-800">
            Latest products
          </h2>
          <ArrowRightCircleIcon
            className="w-6 h-6 text-orange-800 cursor-pointer"
            onClick={() => router.push("/items")}
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
          {loading
            ? renderSkeletons()
            : products.map((product) => {
                // Calculate prices and discount per product
                const salesPrice = parseFloat(product.sales_price);
                const regularPrice = parseFloat(product.regular_price);
                const discount =
                  regularPrice > salesPrice
                    ? Math.round(
                        ((regularPrice - salesPrice) / regularPrice) * 100
                      )
                    : 0;

                return (
                  <div
                    onClick={() => router.push(`/items/${product.slug}`)}
                    key={product.id}
                    className="bg-white rounded-xl overflow-hidden shadow relative group cursor-pointer"
                  >
                    {/* Product Image */}
                    <div className="relative">
                      <Image
                        src={product.images?.[0] || "/placeholder.png"}
                        alt={product.title}
                        width={400}
                        height={400}
                        className="w-full h-56 object-cover"
                      />

                      {/* Discount Badge */}
                      {discount > 0 && (
                        <div className="absolute top-2 left-2 bg-yellow-400 text-red-800 font-bold text-xs px-2 py-1 rounded shadow">
                          -{discount}%
                        </div>
                      )}
                    </div>

                    <div className="p-3">
                      {/* Ratings */}
                      <div className="flex items-center gap-1 text-yellow-400 mb-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={i}>
                            {i < product.average_rating ? "★" : "☆"}
                          </span>
                        ))}
                      </div>

                      {/* Product Title */}
                      <h3 className="text-sm font-semibold text-gray-900 mb-1 truncate">
                        {product.title}
                      </h3>

                      {/* Price */}
                      <p className="flex items-baseline gap-1">
                        <span className="text-sm font-bold text-gray-900">
                          {formatAmount(salesPrice)}
                        </span>
                        {discount > 0 && (
                          <span className="text-[9px] line-through text-gray-400">
                            {formatAmount(regularPrice)}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                );
              })}
        </div>
      </div>
    </section>
  );
};

export default LatestProducts;
