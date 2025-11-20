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

export const navItems: NavItem[] = [
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
