"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { MinusIcon, PlusIcon, CheckIcon } from "@heroicons/react/24/outline";
import ItemTabs, { StarRating } from "./ItemTabs";
import { useCart } from "@/context/CartContext";
import { formatAmount } from "@/utils/formatCurrency";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import WishlistButton from "@/app/(customer)/account/wishlists/components/WishlistButton";
import parse from "html-react-parser";
import Item from "@/interfaces/items";

interface ItemDetailProps {
  product: Item;
  reviews: any[];
  star_rating: StarRating; // <-- add this
  recommended: Item[];
  frequentlyBoughtTogether: Item[];
  otherViews: Item[];
}

export default function ItemDetail({
  product,
  reviews,
  star_rating,
  recommended,
  frequentlyBoughtTogether,
  otherViews,
}: ItemDetailProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(
    product.images?.[0] || "/placeholder.png"
  );
  const [added, setAdded] = useState(false);

  const { addToCart, cart } = useCart();
  const router = useRouter();

  const isInCart = useMemo(
    () => cart?.some((item) => item.id === product.id),
    [cart, product.id]
  );

  const increaseQty = () => setQuantity((q) => q + 1);
  const decreaseQty = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  const salesPrice = parseFloat(product.sales_price);
  const regularPrice = parseFloat(product.regular_price);

  const discount =
    regularPrice > salesPrice
      ? Math.round(((regularPrice - salesPrice) / regularPrice) * 100)
      : 0;

  const handleAddToCart = () => {
    if (!isInCart) {
      addToCart({
        id: product.id,
        title: product.title,
        slug: product.slug,
        type: product.type,
        price: salesPrice,
        image: selectedImage,
        qty: quantity,
        stock: true,
      });

      toast.success("Item added to cart!");
      setAdded(true);
      setTimeout(() => setAdded(false), 1000);
    } else {
      router.push("/carts");
    }
  };

  return (
    <>
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* LEFT IMAGE SECTION */}
          <div className="flex gap-4 lg:col-span-1">
            <div className="flex flex-col gap-3">
              {product.images?.map((img, i) => (
                <Image
                  key={i}
                  src={img}
                  alt={`${product.title} ${i}`}
                  width={80}
                  height={80}
                  className={`rounded-md cursor-pointer border ${
                    selectedImage === img ? "border-red-800" : "border-gray-200"
                  }`}
                  onClick={() => setSelectedImage(img)}
                />
              ))}
            </div>

            <div>
              <Image
                src={selectedImage}
                alt={product.title}
                width={700}
                height={700}
                className="rounded-lg shadow-md w-full object-cover"
              />
            </div>
          </div>

          {/* PRODUCT INFO */}
          <div className="flex flex-col space-y-4">
            <h1 className="text-2xl font-semibold">{product.title}</h1>

            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-gray-900">
                {formatAmount(salesPrice)}
              </span>

              {regularPrice > salesPrice && (
                <>
                  <span className="line-through text-gray-400">
                    {formatAmount(regularPrice)}
                  </span>
                  <span className="text-red-800 font-semibold">
                    -{discount}%
                  </span>
                </>
              )}
            </div>

            <div className="text-gray-500 line-clamp-2">
              {parse(product.description)}
            </div>

            {/* QUANTITY + ADD TO CART */}
            <div className="flex items-center gap-2 mt-5">
              <div className="flex items-center rounded-md">
                <button
                  onClick={decreaseQty}
                  className="btn btn-gray rounded-full!"
                >
                  <MinusIcon className="h-4 w-4" />
                </button>
                <span className="px-4 text-gray-500 font-semibold">
                  {quantity}
                </span>
                <button
                  onClick={increaseQty}
                  className="btn btn-gray rounded-full!"
                >
                  <PlusIcon className="h-4 w-4" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className={`btn btn-primary rounded-full! text-xs! ${
                  added
                    ? "bg-red-800 text-white scale-105"
                    : isInCart
                    ? "bg-red-800 text-white hover:bg-red-700"
                    : "bg-red-400 text-white hover:bg-red-800"
                }`}
              >
                {added ? (
                  <>
                    <CheckIcon className="h-5 w-5 text-white animate-bounce" />
                    Added!
                  </>
                ) : isInCart ? (
                  "View Cart"
                ) : (
                  "Add to Cart"
                )}
              </button>

              {/* @ts-ignore */}
              <WishlistButton product={product} />
            </div>

            <div className="text-sm text-gray-500 space-y-1">
              <p>
                Category:{" "}
                <Link
                  target="_blank"
                  href={`/items?category=${product.category?.slug}&type=${product.type}`}
                  className="text-red-800"
                >
                  {product.category?.name}
                </Link>
              </p>

              <p>{product?.sku}</p>

              <p>
                Seller:{" "}
                <Link
                  target="_blank"
                  className="text-red-800"
                  href={`/shops/${product?.shop?.slug}`}
                >
                  {product?.shop?.name}{" "}
                  <span className="text-gray-500">from</span>{" "}
                  {product?.shop?.country}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* TABS SECTION — NOW USING REAL BACKEND REVIEWS */}
      <ItemTabs
        description={product.description}
        reviews={reviews}
        star_rating={star_rating}
        recommended={recommended}
        frequentlyBoughtTogether={frequentlyBoughtTogether}
        otherViews={otherViews}
      />
    </>
  );
}
