import React from "react";
import Step1Form from "../forms/Step1Form";

export default function CreateProfilePage() {
  // Hàm xử lý submit cuối cùng
  const handleFinalSubmit = () => {
    console.log("Submit data to Redux or API here!");
    // dispatch(createProfile(data))
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4 sm:p-6 md:p-10 text-foreground">
      <div className="w-full max-w-3xl rounded-2xl border border-border bg-card p-6 shadow-2xl sm:p-8">
        
        {/* Header */}
        <div className="mb-8 flex items-center justify-between border-b border-border pb-4">
          <h1 className="text-xl font-bold text-white sm:text-2xl">Complete Your Profile</h1>
          
          {/* Tạm ẩn bộ đếm số bước vì hiện tại chỉ dùng 1 form */}
          {/* <div className="text-sm font-medium">
            <span className="text-primary">Step 1</span> <span className="text-slate-400">of 3</span>
          </div> 
          */}
        </div>

        {/* Form Container */}
        <div className="min-h-[400px]">
          {/* TODO: Tạm thời chỉ dùng step 1 */}
          <Step1Form onNext={handleFinalSubmit} />
          
        </div>
        
      </div>
    </div>
  );
}