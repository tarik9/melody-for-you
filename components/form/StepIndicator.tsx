"use client";

const STEPS = [
  { label: "STYLE", number: 1 },
  { label: "RECIPIENT", number: 2 },
  { label: "OCCASION", number: 3 },
  { label: "STORY", number: 4 },
  { label: "DELIVERY", number: 5 },
  { label: "CHECKOUT", number: 6 },
];

interface StepIndicatorProps {
  currentStep: number;
}

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  const progressPercent = ((currentStep - 1) / (STEPS.length - 1)) * 100;

  return (
    <div className="w-full mb-6">
      {/* Step labels row */}
      <div className="flex items-center justify-between relative">
        {/* Progress bar background */}
        <div className="absolute top-4 left-4 right-4 h-0.5 bg-gray-200 z-0">
          <div
            className="h-full bg-[#7C3AED] transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {STEPS.map((step) => {
          const isDone = currentStep > step.number;
          const isActive = currentStep === step.number;

          return (
            <div
              key={step.number}
              className="relative z-10 flex flex-col items-center gap-1.5"
            >
              {/* Circle */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-300 ${
                  isDone
                    ? "bg-[#7C3AED] border-[#7C3AED] text-white"
                    : isActive
                    ? "bg-white border-[#7C3AED] text-[#7C3AED]"
                    : "bg-white border-gray-300 text-gray-400"
                }`}
              >
                {isDone ? (
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  step.number
                )}
              </div>
              {/* Label */}
              <span
                className={`text-[10px] font-semibold tracking-wider hidden sm:block ${
                  isActive
                    ? "text-[#7C3AED]"
                    : isDone
                    ? "text-[#7C3AED]"
                    : "text-gray-400"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
