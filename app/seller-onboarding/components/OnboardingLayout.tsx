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
    <div className="bg-orange-50">
      <div className="w-full mb-2">
        <Image
          src="/store-bg.jpg"
          alt="Ayokah Banner"
          width={1920}
          height={40}
          className="w-full h-40 object-cover"
          priority
        />
      </div>
      <div className="container mx-auto py-2 max-w-6xl p-2">
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
