"use client";

import { useState } from "react";
import OnboardingLayout from "./components/OnboardingLayout";
import StepBankInfo from "./components/StepBankInfo";
import StepImages from "./components/StepImages";
import StepShopInfo from "./components/StepShopInfo";
import StepSubscription from "./components/StepSubscription";
import { useRouter } from "next/navigation";

const STEPS = [
  { id: 1, label: "Shop Info" },
  { id: 2, label: "Shop Images" },
  { id: 3, label: "Bank Info" },
  { id: 4, label: "Shop Sub" },
];


export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);

  const [shopId, setShopId] = useState<number | null>(null);

  const handleNextStep = (data?: any) => {
    if (data?.shopId) {
      setShopId(data.shopId);
    }

    if (currentStep === STEPS.length) {
      router.push("/dashboard");
      return;
    }

    setCurrentStep((prev) => prev + 1);
  };

  const renderStepComponent = () => {
    switch (currentStep) {
      case 1:
        return <StepShopInfo onNext={handleNextStep} />;
      case 2:
        if (!shopId) return <p>Error: Shop ID missing. Please restart.</p>;
        return <StepImages shopId={shopId} onNext={handleNextStep} />;
      case 3:
        return <StepBankInfo onNext={handleNextStep} />;
      case 4:
        return <StepSubscription onNext={handleNextStep} />;
      default:
        return null;
    }
  };

  return (
    <OnboardingLayout steps={STEPS} currentStep={currentStep}>
      {renderStepComponent()}
    </OnboardingLayout>
  );
}
