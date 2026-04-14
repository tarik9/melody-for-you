import React from "react";

interface StepCardProps {
  icon: React.ReactNode;
  title: string;
  stepNumber: number;
  totalSteps: number;
  children: React.ReactNode;
  onBack: () => void;
  onNext: () => void;
  nextLabel?: string;
  backDisabled?: boolean;
  nextDisabled?: boolean;
}

export default function StepCard({
  icon,
  title,
  stepNumber,
  totalSteps,
  children,
  onBack,
  onNext,
  nextLabel = "Next Step",
  backDisabled = false,
  nextDisabled = false,
}: StepCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 step-animate">
      {/* Card header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
            {icon}
          </div>
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        </div>
        <span className="text-gray-400 text-sm font-medium">
          Step {stepNumber} of {totalSteps}
        </span>
      </div>

      {/* Content */}
      <div className="px-6 py-6">{children}</div>

      {/* Navigation */}
      <div className="px-6 pb-6 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          disabled={backDisabled}
          className="flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-medium text-sm hover:border-gray-300 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
        >
          <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
            <path d="M12 4l-6 6 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={nextDisabled}
          className="flex items-center gap-2 px-8 py-3 rounded-xl bg-[#7C3AED] hover:bg-[#5B21B6] text-white font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all duration-200"
        >
          {nextLabel}
          <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
            <path d="M8 4l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
