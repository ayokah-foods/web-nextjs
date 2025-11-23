"use client";

import Image from "next/image";
import { TrashIcon } from "@heroicons/react/24/outline";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";

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
    <div className="bg-gray-50 min-h-screen py-10 px-4 lg:px-10">
      <div className="bg-white rounded-xl shadow p-6 overflow-x-auto">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Wishlist ({wishlist.length})
        </h2>

        <div className="space-y-4">
          {wishlist.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:shadow-sm transition"
            >
              {/* left */}
              <div className="flex items-center gap-4">
                <Image
                  src={item.image}
                  alt={item.title}
                  width={70}
                  height={70}
                  className="rounded-md object-cover"
                />
                <div>
                  <div className="font-medium text-gray-800">{item.title}</div>
                  <div className="text-sm text-gray-500 mt-1">
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded">
                      {item.stock ?? "In stock"}
                    </span>
                  </div>
                </div>
              </div>

              {/* right */}
              <div className="flex items-center gap-6">
                <div className="text-lg font-semibold text-gray-800">
                  {item.price} CAD
                </div>
                <button
                  onClick={() => {
                    addToCart({ ...item, qty: 1 });
                    removeFromWishlist(item.id);
                  }}
                  className="px-4 py-2 bg-orange-800 text-white rounded-full text-sm hover:bg-orange-700 transition"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => removeFromWishlist(item.id)}
                  className="text-gray-500 hover:text-red-600 transition p-2"
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
