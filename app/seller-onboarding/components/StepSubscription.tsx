"use client";

import { useState, useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { ArrowLongRightIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { listSubscriptions } from "@/lib/api/seller/subscription";
import { FaMoneyBill1Wave } from "react-icons/fa6";

interface SubscriptionPlan {
  id: number;
  name: string;
  monthly_price: number;
  features: string[];
  stripe_plan_id: string;
  stripe_price_id: string;
  payment_link_url: string;
}

type StepProps = { onNext?: (data?: any) => void };

export default function StepSubscription({ onNext }: StepProps) {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const subscriptionPlans = await listSubscriptions();
        setPlans(subscriptionPlans);
      } catch (err: any) {
        setError(err.message || "An error occurred while fetching plans.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handleSubscribe = (paymentLinkUrl: string) => {
    window.location.href = paymentLinkUrl;
  };

  const renderLoading = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Skeleton height={400} borderRadius={12} count={3} className="h-full" />
    </div>
  );

  const renderError = () => (
    <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
      <p className="font-medium">Error loading subscriptions</p>
      <p className="text-sm">{error}</p>
    </div>
  );

  return (
    <>
      <div className="border border-orange-100 p-4 rounded-md mb-6">
        <h2 className="text-lg font-semibold flex items-center">
          <FaMoneyBill1Wave
            className="text-orange-800 text-xl mr-2"
            size={24}
          />
          Business Subscription
        </h2>
        <p className="text-sm mt-1 text-gray-600">
          Select the plan that best fits your business needs. You will be
          redirected to a secure Stripe payment gateway.
        </p>
      </div>
      <div className="space-y-6">
        {isLoading ? (
          renderLoading()
        ) : error ? (
          renderError()
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`flex flex-col p-6 rounded-xl border-2 shadow-lg transition-shadow duration-300 
                ${
                  plan.name.toLowerCase().includes("basic")
                    ? "border-indigo-600 shadow-indigo-300"
                    : "border-gray-200 hover:shadow-xl"
                }`}
              >
                {/* Plan Header */}
                <div className="text-center pb-4 border-b border-gray-100">
                  <h3
                    className={`text-2xl font-extrabold ${
                      plan.name.toLowerCase().includes("standard")
                        ? "text-indigo-600"
                        : "text-gray-900"
                    }`}
                  >
                    {plan.name}
                  </h3>
                  <p className="mt-2 text-gray-500 text-sm">
                    Best for{" "}
                    {plan.name.toLowerCase().includes("premium")
                      ? "growing"
                      : "new"}{" "}
                    businesses
                  </p>

                  <p className="mt-4">
                    <span className="text-5xl font-extrabold text-gray-900">
                      £{plan.monthly_price.toFixed(2)}
                    </span>
                    <span className="text-lg font-medium text-gray-500">
                      /month
                    </span>
                  </p>
                </div>

                {/* Feature List */}
                <ul role="list" className="mt-6 space-y-3 grow">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircleIcon className="h-6 w-6 text-orange-800 mr-2 shrink-0" />
                      <span className="text-base text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Action Button */}
                <button
                  type="button"
                  onClick={() => handleSubscribe(plan.payment_link_url)}
                  className={`mt-8 w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm transition duration-150 ease-in-out cursor-pointer
                  ${
                    plan.name.toLowerCase().includes("pro")
                      ? "text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      : "text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  }`}
                >
                  Start {plan.name}
                  <ChevronRightIcon className="ml-1 h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
