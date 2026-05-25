// Step3Form.tsx
import React from "react";

interface StepFormProps {
  onSubmit: () => void;
  onBack: () => void;
}

export default function Step3Form({ onSubmit, onBack }: StepFormProps) {
  return (
    <div className="fade-in flex flex-col gap-6">
      <div className="rounded-xl border border-border bg-slate-800/50 p-10 text-center text-slate-400">
        Step 3 Form...
      </div>
      <div className="mt-4 flex gap-4">
        <button type="button" onClick={onBack} className="btn bg-slate-700 text-white hover:bg-slate-600 sm:w-32">
          Back
        </button>
        <button type="button" onClick={onSubmit} className="btn btn-success flex-1">
          Complete Registration 
        </button>
      </div>
    </div>
  );
}