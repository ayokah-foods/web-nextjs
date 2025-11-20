"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LuLayoutDashboard,
  LuPackage,
  LuShoppingCart,
  LuMessageCircle,
  LuWallet,
  LuSettings,
  LuUsers,
  LuShoppingBag,
  LuMegaphone,
  LuList,
  LuLogOut,
} from "react-icons/lu";
import { useAuthStore } from "@/store/useAuthStore";

interface NavItem {
  id: number;
  label: string;
  href: string;
  icon: React.ElementType;
  children?: NavItem[];
}

const navItems: NavItem[] = [
  { id: 1, label: "Dashboard", href: "/dashboard", icon: LuLayoutDashboard },
  {
    id: 2,
    label: "Product Management",
    href: "/product-management",
    icon: LuPackage,
    children: [],
  },
  {
    id: 3,
    label: "Order Management",
    href: "/order-management",
    icon: LuShoppingCart,
  },
  {
    id: 4,
    label: "Customer Feedback",
    href: "/customer-feedback",
    icon: LuMessageCircle,
  },
  {
    id: 5,
    label: "Finance & Payment",
    href: "/finance-payment",
    icon: LuWallet,
  },
  {
    id: 7,
    label: "Accounts & Settings",
    href: "/accounts-settings",
    icon: LuSettings,
    children: [
      // Assuming sub-settings links
    ],
  },
  { id: 8, label: "Vendor Support", href: "/vendor-support", icon: LuUsers },
  {
    id: 9,
    label: "Shop Management",
    href: "/shop-management",
    icon: LuShoppingBag,
    children: [
      {
        id: 91,
        label: "Shop Profile & Branding",
        href: "/shop-management/profile",
        icon: LuShoppingBag,
      },
      {
        id: 92,
        label: "Promotions & Discounts",
        href: "/shop-management/promotions",
        icon: LuMegaphone,
      },
      {
        id: 93,
        label: "Store Policies",
        href: "/shop-management/policies",
        icon: LuList,
      },
    ],
  },
];

const NavLink = ({
  item,
  currentPath,
}: {
  item: NavItem;
  currentPath: string;
}) => {
  const isActive =
    currentPath === item.href ||
    (item.children &&
      item.children.some((child) => currentPath.startsWith(child.href)));
  const isParentActive = currentPath.startsWith(item.href);
  const hasChildren = item.children && item.children.length > 0;

  const baseClasses =
    "flex items-center p-3 text-sm font-medium transition-colors duration-150 rounded-lg";
  const activeClasses = "bg-orange-100 text-orange-800";
  const inactiveClasses = "text-gray-700 hover:bg-gray-100";

  return (
    <li>
      <Link
        href={item.href}
        className={`${baseClasses} ${
          isActive ? activeClasses : inactiveClasses
        }`}
        aria-current={isActive ? "page" : undefined}
      >
        <item.icon className="w-5 h-5 mr-3" />
        {item.label}
      </Link>

      {hasChildren && isParentActive && (
        <ul className="pl-6 pt-1 space-y-1">
          {item.children!.map((child) => (
            <li key={child.id}>
              <Link
                href={child.href}
                className={`flex items-center py-2 px-3 text-xs rounded-lg transition-colors duration-150 ${
                  currentPath === child.href
                    ? "text-orange-800 font-semibold"
                    : "text-gray-600 hover:text-orange-600"
                }`}
              >
                {child.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

export function Sidebar() {
  const router = useRouter();
  const currentPath = usePathname();
  const { clearAuth } = useAuthStore();
  const handleLogout = () => {
    clearAuth();
    router.push("/login");
  };
  return (
    <div className="flex flex-col w-64 bg-white border-r border-gray-200">
      {/* Logo Area */}
      <div className="flex items-center justify-center h-20 border-b border-gray-200 p-4">
        <span className="text-xl font-bold text-orange-900 flex items-center">
          <img src="/logo.svg" alt="Ayokah logo" className="h-10 w-auto mr-2" />
        </span>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <NavLink key={item.id} item={item} currentPath={currentPath} />
          ))}
        </ul>
      </nav>

      {/* Log Out */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="flex items-center w-full p-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-150 cursor-pointer"
        >
          <LuLogOut className="w-5 h-5 mr-3" />
          Log Out
        </button>
      </div>
    </div>
  );
}
