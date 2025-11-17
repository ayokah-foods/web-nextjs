"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MapPinIcon, UserIcon } from "@heroicons/react/24/outline";
import { useAuthStore } from "@/store/useAuthStore";

export default function HeaderActions() {
  const router = useRouter();
  const { user } = useAuthStore();
  console.log("HeaderActions user:", user);
  const firstName = user?.name;

  return (
    <div className="flex items-center gap-3 sm:gap-4">
      <motion.button
        onClick={() => router.push("/track-order")}
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
        className="px-2 sm:px-4 py-2 flex items-center justify-center bg-orange-200 rounded-full cursor-pointer
                   text-orange-900 hover:bg-orange-600 hover:text-white transition-all duration-300 
                   focus:outline-none focus:ring-2 focus:ring-orange-400"
      >
        <MapPinIcon className="w-4 h-4 lg:w-5 lg:h-5" />
        <span className="hidden sm:inline ml-1">Track Order</span>
      </motion.button>

      {/* User Icon / Greeting */}
      <motion.button
        onClick={() => router.push(user ? "/dashboard" : "/login")}
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
        className="px-2 sm:px-4 py-2 flex items-center justify-center bg-orange-200 rounded-full cursor-pointer
                   text-orange-900 hover:bg-orange-600 hover:text-white transition-all duration-300 
                   focus:outline-none focus:ring-2 focus:ring-orange-400"
      >
        <UserIcon className="w-4 h-4 lg:w-5 lg:h-5" />
        <span className="hidden sm:inline ml-1">
          {firstName ? `Hi, ${firstName}` : "My Account"}
        </span>
      </motion.button>
    </div>
  );
}
