"use client";

import { getOverview } from "@/lib/api/seller/overview";
import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import {
  FaBox,
  FaTruck,
  FaShoppingCart,
  FaTimesCircle,
  FaUndo,
  FaHourglassHalf,
} from "react-icons/fa";
import { IconType } from "react-icons";

interface StatCardProps {
  title: string;
  value?: string | number;
  loading?: boolean;
  icon: IconType; 
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  loading,
  icon: Icon,
}) => (
  <div className="card border-b-4 border-orange-300 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/7 p-4 cursor-pointer hover:bg-orange-50 transition duration-300 ease-in-out hover:shadow-lg transform hover:-translate-y-1 rounded-lg">
    <div className="flex items-center justify-between mb-0">
      <div className="text-sm font-medium text-gray-500">{title}</div>
      <Icon className="text-md text-orange-500" />
    </div>
    {/* Value section */}
    <div className="flex items-baseline gap-2">
      <div className="text-4xl font-bold text-orange-900">
        {loading ? (
          <Skeleton
            width={80}
            height={28}
            baseColor="#fdbb74"
            highlightColor="#fff7ed"
          />
        ) : (
          value
        )}
      </div>
    </div>
  </div>
);

interface Stats {
  total_orders: number;
  new_orders: number;
  ongoing_orders: number;
  shipped_orders: number;
  cancelled_orders: number;
  returned_orders: string;
}

interface OverviewProps {
  period: string;
}

const Overview: React.FC<OverviewProps> = ({ period }) => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await getOverview(period);
        setStats(response);
      } catch (err) {
        console.error("Failed to fetch stats:", err);
        setError("Failed to load statistics. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    if (period) {
      fetchStats();
    }
  }, [period]);

  if (error) {
    return <div className="card p-6 text-red-400">{error}</div>;
  }

  // Map icons to the card data
  const statCards = [
    { title: "Total Orders", value: stats?.total_orders, icon: FaShoppingCart },
    { title: "New Orders", value: stats?.new_orders, icon: FaBox },
    {
      title: "Ongoing Orders",
      value: stats?.ongoing_orders,
      icon: FaHourglassHalf,
    },
    { title: "Shipped Orders", value: stats?.shipped_orders, icon: FaTruck },
    {
      title: "Cancel. Orders",
      value: stats?.cancelled_orders,
      icon: FaTimesCircle,
    },
    { title: "Returned Orders", value: stats?.returned_orders, icon: FaUndo },
  ];

  return (
    <div className="flex flex-wrap gap-9">
      {statCards.map((card) => (
        <StatCard
          key={card.title}
          title={card.title}
          value={card.value}
          loading={isLoading}
          icon={card.icon} 
        />
      ))}
    </div>
  );
};

export default Overview;
