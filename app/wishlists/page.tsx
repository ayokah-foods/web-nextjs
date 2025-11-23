"use client";

import Image from "next/image";
import { TrashIcon } from "@heroicons/react/24/outline";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { formatAmount } from "@/utils/formatCurrency";
import toast from "react-hot-toast";

export default function WishlistPage() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const router = useRouter();

  if (!wishlist || wishlist.length === 0) {
    return (
      <div className="bg-gray-50 min-h-screen py-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">
            Your Wishlist is Empty
          </h2>
          <p className="text-gray-600 mb-6">Items you save will appear here.</p>
          <button
            onClick={() => router.push("/items")}
            className="btn btn-primary"
          >
            Browse Items
          </button>
        </div>
      </div>
    );
  }

return (
  <div className="bg-gray-50 min-h-screen py-6 px-3 md:px-6 lg:px-10">
    <div className="bg-white rounded-xl shadow p-4 md:p-6">
      <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4 md:mb-6">
        Wishlist ({wishlist.length})
      </h2>

      <div className="space-y-4">
        {wishlist.map((item) => (
          <div
            key={item.id}
            className="
              flex flex-col md:flex-row 
              md:items-center justify-between 
              gap-4 p-4 border rounded-lg 
              hover:shadow-sm transition
            "
          >
            {/* Left */}
            <div className="flex items-center gap-3 md:gap-4">
              <Image
                src={item.image}
                alt={item.title}
                width={70}
                height={70}
                className="rounded-md object-cover"
              />

              <div>
                <div className="font-medium text-gray-800 text-sm md:text-base">
                  {item.title}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded">
                    {item.stock ?? "In stock"}
                  </span>
                </div>
              </div>
            </div>

            {/* Right */}
            <div
              className="
                flex md:flex-row flex-row 
                items-center md:justify-end 
                gap-3 md:gap-6
              "
            >
              <div className="text-base md:text-lg font-semibold text-gray-800">
                {formatAmount(item.price)}
              </div>

              <button
                onClick={() => {
                  addToCart({ ...item, qty: 1 });
                  removeFromWishlist(item.id);
                  toast.success(`${item.title} added to cart!`); 
                }}
                className="btn btn-primary text-xs!"
              >
                Add to Cart
              </button>

              <button
                onClick={() => removeFromWishlist(item.id)}
                className="btn btn-gray hover:text-red-600!"
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

}
