// Step2Form.tsx
import React from "react";

interface StepFormProps {
  onNext: () => void;
  onBack: () => void;
}

export default function Step2Form({ onNext, onBack }: StepFormProps) {
  return (
    <div className="fade-in flex flex-col gap-6">
      <div className="rounded-xl border border-border bg-slate-800/50 p-10 text-center text-slate-400">
        Step 2 Form...
      </div>
      <div className="mt-4 flex gap-4">
        <button type="button" onClick={onBack} className="btn bg-slate-700 text-white hover:bg-slate-600 sm:w-32">
          Back
        </button>
        <button type="button" onClick={onNext} className="btn btn-primary flex-1">
          Continue to Final Step
        </button>
      </div>
    </div>
  );
}