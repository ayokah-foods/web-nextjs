"use client";

import React, { useState } from "react";
import { RecentReviews } from "./components/Review";
import Overview from "./components/Overview";
import SelectDropdown from "./components/commons/Fields/SelectDropdown";
import AreaChart from "./components/commons/AreaChart";
import RecentOrdersTable from "@/app/orders/components/RecentOrdersTable";

const periods = [
  { value: "last_year", label: "All" },
  { value: "this_week", label: "This week" },
  { value: "last_week", label: "Last week" },
  { value: "last_month", label: "Last month" },
  { value: "last_year", label: "Last year" },
];

const DashboardPage: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState(periods[0]);

  return (
    <div className="space-y-4 text-gray-700 p-4 md:p-0">
      <div className="flex items-center justify-between">
        <SelectDropdown
          options={[
            { value: "all", label: "All" },
            { value: "this_week", label: "This week" },
            { value: "last_week", label: "Last week" },
            { value: "last_month", label: "Last month" },
            { value: "last_year", label: "Last year" },
          ]}
          value={selectedPeriod}
          onChange={setSelectedPeriod}
        />
      </div>
      <Overview period={selectedPeriod.value} />
      <div className="flex flex-wrap gap-4"> 
        <div className="card w-full md:w-[calc(70%-0.5rem)]"> 
          <AreaChart />
        </div>
 
        <div className="card w-full md:w-[calc(30%-0.5rem)] p-6"> 
          <RecentReviews />
        </div>
      </div>
      <RecentOrdersTable limit={10} />
    </div>
  );
};

export default DashboardPage;
