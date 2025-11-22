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

interface NavItem {
  id: number;
  label: string;
  href: string;
  icon: React.ElementType;
  children?: NavItem[];
}

export const NAVIGATION: NavItem[] = [
  { id: 1, label: "Dashboard", href: "/dashboard", icon: LuLayoutDashboard },
  {
    id: 2,
    label: "Item Management",
    href: "/item-management",
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

export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const DIMENSION_OPTIONS = [
  { label: "g", value: "g" },
  { label: "kg", value: "kg" },
  { label: "lbs", value: "lbs" },
  { label: "oz", value: "oz" },
];
export const SIZE_UNIT_OPTIONS = [
  { label: "cm", value: "cm" },
  { label: "mm", value: "mm" },
  { label: "in", value: "in" },
];

export const PRICING_MODEL_OPTIONS = [
  { value: "fixed", label: "Fixed" },
  { value: "negotiable", label: "Negotiable" },
];

export const DELIVERY_METHOD_OPTIONS = [
  { value: "online", label: "Online" },
  { value: "offline", label: "Offline" },
  { value: "hybrid", label: "Hybrid" },
];

export const MAX_IMAGES = 7;
export const MAX_IMAGE_SIZE = 2 * 1024 * 1024;
export const VALID_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];