"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  FiUser,
  FiPackage,
  FiHeart,
  FiMapPin,
  FiSettings,
  FiUsers,
  FiLifeBuoy,
  FiLogOut,
} from "react-icons/fi";

const menuItems = [
  { name: "Account Overview", href: "/account", icon: FiUser },
  { name: "Orders", href: "/account/orders", icon: FiPackage },
  { name: "Wishlist", href: "/account/wishlist", icon: FiHeart },
  { name: "Address", href: "/account/address", icon: FiMapPin },
  { name: "Setting", href: "/account/setting", icon: FiSettings },
  { name: "Referral", href: "/account/referral", icon: FiUsers },
  { name: "Support", href: "/account/support", icon: FiLifeBuoy },
];

export default function AccountSidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-28 card">
      <nav className="space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              href={item.href}
              key={item.name}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200
                ${
                  isActive
                    ? "bg-orange-100 text-orange-600 font-medium"
                    : "hover:bg-gray-100 text-gray-700"
                }
              `}
            >
              <Icon size={18} className={isActive ? "text-orange-600" : "text-gray-500"} />
              <span className="relative">
                {item.name}
                {isActive && (
                  <span className="absolute left-0 -bottom-1 h-[2px] w-full bg-orange-500 rounded-full" />
                )}
              </span>
            </Link>
          );
        })}

        {/* Logout Button */}
        <button className="mt-4 flex items-center justify-center gap-2 text-red-600 font-medium bg-red-50 px-3 py-2 rounded-lg hover:bg-red-100 transition-all duration-200 w-full">
          Log out
          <FiLogOut size={18} />
        </button>
      </nav>
    </aside>
  );
}
