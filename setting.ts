import { FaDhl } from "react-icons/fa6";
import { SiFedex, SiUps, SiUsps, SiAmazon, SiDeliveroo } from "react-icons/si";
import { MdLocalShipping } from "react-icons/md";

import {
  FiUser,
  FiPackage,
  FiHeart,
  FiMapPin,
  FiSettings,
  FiLifeBuoy,
  FiBell,
} from "react-icons/fi";

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

export const CUSTOMER_MENU = [
  { name: "Account Overview", href: "/account", icon: FiUser },
  { name: "Orders", href: "/account/orders", icon: FiPackage },
  { name: "Track Order", href: "/account/tracking-order", icon: FiMapPin },
  { name: "Wishlist", href: "/account/wishlists", icon: FiHeart },
  { name: "Address", href: "/account/address", icon: FiMapPin },
  { name: "Notifications", href: "/account/notifications", icon: FiBell },
  { name: "Support", href: "/account/support", icon: FiLifeBuoy },
  { name: "Setting", href: "/account/settings", icon: FiSettings },
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
  { label: "pound", value: "lbs" }, // ShipEngine expects "pound"
  { label: "ounce", value: "oz" }, // ShipEngine expects "ounce"
];

export const SIZE_UNIT_OPTIONS = [
  { label: "inch", value: "in" }, // ShipEngine expects "inch"
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
export const VALID_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const CARRIER_ICONS: Record<
  string,
  { icon: React.ComponentType<any>; color: string }
> = {
  dhl: { icon: FaDhl, color: "#FFCC00" },
  fedex: { icon: SiFedex, color: "#4D148C" },
  ups: { icon: SiUps, color: "#180B02" },
  usps: { icon: SiUsps, color: "#3333CC" },
  amazon: { icon: SiAmazon, color: "#FF9900" },

  // fallback carriers you may add later
  deliveroo: { icon: SiDeliveroo, color: "#00CCBC" },

  // default fallback
  default: { icon: MdLocalShipping, color: "#FF9920" },
};

export const UK_TIMEZONE = "Europe/London";
