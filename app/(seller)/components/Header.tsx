// app/components/seller/Header.tsx

"use client";

import React from "react";
import Link from "next/link";
import { Menu, Transition } from "@headlessui/react";
import {
  LuSearch,
  LuBell,
  LuUser,
  LuLogOut,
  LuSettings,
  LuFileText,
} from "react-icons/lu";
import { Fragment } from "react";
// Import the Auth Store
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";

// Tailwind helper for combining classes
function classNames(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

// Helper function to get initials
const getInitials = (name: string | undefined): string => {
  if (!name) return "A"; // Default initial if name is missing
  const parts = name.split(" ").filter((p) => p.length > 0);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

// Placeholder for the Avatar component
const UserAvatar = ({
  initial,
  className,
}: {
  initial: string;
  className?: string;
}) => (
  <span
    className={classNames(
      "inline-flex items-center justify-center rounded-full bg-orange-500 text-white font-semibold",
      className || "h-10 w-10 text-lg"
    )}
  >
    {initial}
  </span>
);

export function Header() {
  const router = useRouter();

  // 1. Access the store state and actions
  const { user, clearAuth } = useAuthStore();

  // 2. Derive user display data
  const userName = user?.name || user?.email || "Seller"; // Use name, fall back to email, then "Seller"
  const userInitial = getInitials(user?.name);

  // 3. Handle Logout Logic
  const handleLogout = () => {
    clearAuth();
    // Redirect the user to the login page after logging out
    router.push("/login"); // Adjust this path to your actual login route
  };

  if (!user) {
    // Optionally render a skeleton or redirect if user is somehow null here
    return null;
  }

  return (
    <header className="sticky top-0 z-30 flex items-center h-20 bg-white border-b border-gray-200 px-6">
      {/* Search Input */}
      <div className="flex-1 max-w-lg hidden lg:block">
        {/* ... (Search input logic remains the same) ... */}
        <div className="relative">
          <LuSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="search"
            placeholder="Search by product, order, or customer..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:border-orange-500 focus:ring-orange-500"
          />
        </div>
      </div>

      {/* Right Side: Icons and Profile */}
      <div className="ml-auto flex items-center space-x-4">
        {/* Notification Icon */}
        <button
          type="button"
          className="p-2 text-gray-500 hover:text-orange-500 relative transition-colors duration-150"
        >
          <LuBell className="w-6 h-6" />
          <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
        </button>

        {/* Profile Dropdown (Headless UI Menu) */}
        <Menu as="div" className="relative ml-3">
          {/* Button */}
          <div>
            <Menu.Button className="flex items-center space-x-2 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">
              <span className="sr-only">Open user menu</span>
              {/* Dynamically display user name */}
              <span className="hidden sm:inline font-medium text-gray-700">
                {userName}
              </span>
              {/* Dynamically display user initial */}
              <UserAvatar
                initial={userInitial}
                className="h-10 w-10 text-base"
              />
            </Menu.Button>
          </div>

          {/* Dropdown Panel */}
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 z-40 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="px-4 py-3">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {userName}
                </p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>

              <div className="py-1">
                <Menu.Item>
                  {({ active }) => (
                    // Link to Profile settings
                    <Link
                      href="/accounts-settings/profile"
                      className={classNames(
                        active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                        "flex items-center px-4 py-2 text-sm"
                      )}
                    >
                      <LuSettings className="w-4 h-4 mr-3" /> Profile settings
                    </Link>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    // Link to Account settings
                    <Link
                      href="/accounts-settings/security"
                      className={classNames(
                        active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                        "flex items-center px-4 py-2 text-sm"
                      )}
                    >
                      <LuFileText className="w-4 h-4 mr-3" /> Account settings
                    </Link>
                  )}
                </Menu.Item>
              </div>

              <div className="py-1">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={handleLogout} // Use the logout handler
                      className={classNames(
                        active ? "bg-gray-100 text-red-600" : "text-red-500",
                        "flex items-center w-full text-left px-4 py-2 text-sm"
                      )}
                    >
                      <LuLogOut className="w-4 h-4 mr-3" /> Log out
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </header>
  );
}
