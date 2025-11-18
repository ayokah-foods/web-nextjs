import { User } from "@/interfaces/user";

interface RecentOrderSectionProps {
  user: User | null;
}

export default function RecentOrderSection({ user }: RecentOrderSectionProps) {
  return (
    <div className="card">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold">Recent Order History</h3>
        <a className="text-sm text-orange-500 hover:underline cursor-pointer">
          See all orders
        </a>
      </div>
      <div className="text-sm text-gray-700">No recent orders.</div>
    </div>
  );
}
