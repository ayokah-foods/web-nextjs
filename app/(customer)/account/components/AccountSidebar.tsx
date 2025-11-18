"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  { name: "Account Overview", href: "/123/account" },
  { name: "Orders", href: "/123/account/orders" },
  { name: "Wishlist", href: "/123/account/wishlist" },
  { name: "Address", href: "/123/account/address" },
  { name: "Payment Method", href: "/123/account/payment" },
  { name: "Setting", href: "/123/account/setting" },
  { name: "Referral", href: "/123/account/referral" },
  { name: "Support", href: "/123/account/support" },
];

export default function AccountSidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-28 p-5 bg-white rounded-xl shadow-sm border">
      <nav className="space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              href={item.href}
              key={item.name}
              className={`
                block px-3 py-2 rounded-lg transition-all duration-200
                ${
                  isActive
                    ? "bg-orange-100 text-orange-600 font-medium"
                    : "hover:bg-gray-100 text-gray-700"
                }
              `}
            >
              <span className="relative inline-block">
                {item.name}
                {/* active underline animation */}
                {isActive && (
                  <span className="absolute left-0 -bottom-1 h-[2px] w-full bg-orange-500 rounded-full" />
                )}
              </span>
            </Link>
          );
        })}

        <button className="text-red-600 text-sm font-medium mt-3 hover:underline">
          Log out
        </button>
      </nav>
    </aside>
  );
}
