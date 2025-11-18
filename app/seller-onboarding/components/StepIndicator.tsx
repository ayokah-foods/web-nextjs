import { CheckCircleIcon } from "@heroicons/react/24/solid";

type StepProps = {
  steps: { id: number; label: string }[];
  activeStep: number;
  setActiveStep: (step: number) => void;
};

export default function StepIndicator({
  steps,
  activeStep,
  setActiveStep,
}: StepProps) {
  return (
    <div className="flex items-center justify-between">
      {steps.map((step) => {
        const completed = step.id < activeStep;
        const isActive = step.id === activeStep;

        return (
          <button
            key={step.id}
            onClick={() => setActiveStep(step.id)}
            className="flex flex-col items-center text-sm"
          >
            <div
              className={`w-10 h-10 flex items-center justify-center rounded-full border 
              ${
                completed
                  ? "bg-green-500 text-white"
                  : isActive
                  ? "border-orange-800 text-orange-800"
                  : "border-gray-300 text-gray-400"
              }`}
            >
              {completed ? <CheckCircleIcon className="w-6 h-6" /> : step.id}
            </div>
            <span
              className={`mt-2 ${
                isActive ? "font-bold text-orange-600" : "text-gray-500"
              }`}
            >
              {step.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
