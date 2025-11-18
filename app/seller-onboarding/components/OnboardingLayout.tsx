"use client";

import { useState } from "react";
import Image from "next/image";
import StepIndicator from "./StepIndicator";

type Step = {
  id: number;
  label: string;
  component: React.ReactNode;
};

export default function OnboardingLayout({ steps }: { steps: Step[] }) {
  const [activeStep, setActiveStep] = useState(1);

  const currentStep = steps.find((s) => s.id === activeStep);

  return (
    <div className="bg-yellow-50">
      <div className="w-full mb-6">
        <Image
          src="/store-bg.jpg"
          alt="Ayokah Banner"
          width={1920}
          height={50}
          className="w-full h-50 object-cover"
          priority
        />
      </div>
      <div className="container mx-auto py-10 max-w-6xl p-2">
        {/* Logo / Nav Image */}

        <h1 className="text-3xl font-bold mb-6 text-center">
          Seller Onboarding
        </h1>

        <StepIndicator
          steps={steps}
          activeStep={activeStep}
          setActiveStep={setActiveStep}
        />

        <div className="mt-10 bg-white p-6 rounded-xl shadow-sm border">
          {currentStep?.component}
        </div>
      </div>
    </div>
  );
}
