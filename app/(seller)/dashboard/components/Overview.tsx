"use client";

import { getOverview } from "@/lib/api/seller/overview";
import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface StatCardProps {
  title: string;
  value?: string | number;
  loading?: boolean;
}

// Updated StatCard to have a defined width for responsiveness
const StatCard: React.FC<StatCardProps> = ({ title, value, loading }) => (
  //   <div className="card border-b border-orange-100 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/7 p-4 cursor-pointer hover:bg-orange-200">
  <div className="card border-b-4 border-orange-300 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/7 p-4 cursor-pointer hover:bg-orange-50 transition duration-300 ease-in-out hover:shadow-lg transform hover:-translate-y-1 rounded-lg">
    <div className="mt-2 flex items-baseline gap-2">
      <div className="text-5xl font-bold text-orange-900">
        {loading ? (
          <Skeleton
            width={80}
            height={28}
            baseColor="#444"
            highlightColor="#666"
          />
        ) : (
          value
        )}
      </div>
    </div>
    <div className="text-sm font-medium text-gray-500">{title}</div>
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

  const statCards = [
    { title: "Total Orders", value: stats?.total_orders },
    { title: "New Orders", value: stats?.new_orders },
    { title: "Ongoing Orders", value: stats?.ongoing_orders },
    { title: "Shipped Orders", value: stats?.shipped_orders },
    { title: "Cancelled Orders", value: stats?.cancelled_orders },
    { title: "Returned Orders", value: stats?.returned_orders },
  ];

  return (
    // Changed from `justify-between gap-4` to `flex-wrap gap-4`
    // which allows items to wrap onto the next line when they run out of space.
    <div className="flex flex-wrap gap-4">
      {statCards.map((card) => (
        <StatCard
          key={card.title}
          title={card.title}
          value={card.value}
          loading={isLoading}
        />
      ))}
    </div>
  );
};

export default Overview;
