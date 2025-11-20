"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from "@headlessui/react";
import {
  LuBell,
  LuLogOut,
  LuSettings,
  LuFileText,
} from "react-icons/lu";
import { Fragment } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/interfaces/user";
import { useAuthStore } from "@/store/useAuthStore";

// Tailwind helper for combining classes
function classNames(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

// -------------------------------------------------------------------
// NEW: Photo Component (Simplified)
// -------------------------------------------------------------------
const UserPhoto = ({ user }: { user: User }) => {
  const userPhoto = user.profile_photo || "/default-avatar.png";
  const userName = user.name || user.email || "Seller";

  return (
    <div className="relative h-10 w-10 shrink-0">
      <Image
        src={userPhoto}
        alt={`${userName}'s profile photo`}
        layout="fill"
        objectFit="cover"
        className="rounded-full"
        priority={false}
      />
    </div>
  );
};

export function Header() {
  const router = useRouter();
  const { user, clearAuth } = useAuthStore();

  const userName = user?.name || user?.email || "Seller";
  const userEmail = user?.email || "";

  const handleLogout = () => {
    clearAuth();
    router.push("/login");
  };

  if (!user) {
    return null;
  }

  return (
    <header className="sticky top-0 z-30 flex items-center h-20 bg-white border-b border-gray-200 px-6 p-2">
      <div className="ml-auto flex items-center space-x-4">
        <button
          type="button"
          className="p-2 text-gray-500 hover:text-orange-500 relative transition-colors duration-150 cursor-pointer"
        >
          <LuBell className="w-6 h-6" />
          <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
        </button>

        <Menu as="div" className="relative ml-3">
          {/* Button */}
          <div>
            <MenuButton className="flex items-center space-x-2 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 cursor-pointer">
              <span className="sr-only">Open user menu</span>
              <span className="hidden sm:inline font-medium text-gray-700">
                {userName}
              </span>
              <UserPhoto user={user} />
            </MenuButton>
          </div>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <MenuItems className="absolute right-0 z-40 mt-2 w-56 origin-top-right divide-y  divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-orange-50 ring-opacity-5 focus:outline-none">
              <div className="px-4 py-3">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {userName}
                </p>
                <p className="text-xs text-gray-500 truncate">{userEmail}</p>
              </div>

              <div className="py-1">
                <MenuItem>
                  {({ active }) => (
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
                </MenuItem>
                <MenuItem>
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
                </MenuItem>{" "}
              </div>

              <div className="py-1">
                <MenuItem>
                  {({ active }) => (
                    <button
                      onClick={handleLogout}
                      className={classNames(
                        active ? "bg-gray-100 text-red-600" : "text-red-500",
                        "flex items-center w-full text-left px-4 py-2 text-sm  cursor-pointer"
                      )}
                    >
                      <LuLogOut className="w-4 h-4 mr-3" /> Log out
                    </button>
                  )}
                </MenuItem>
              </div>
            </MenuItems>
          </Transition>
        </Menu>
      </div>
    </header>
  );
}
