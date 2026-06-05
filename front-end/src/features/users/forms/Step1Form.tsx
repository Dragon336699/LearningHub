import { faGraduationCap, faPersonChalkboard, faPlus, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";

interface Step1FormProps {
  onNext: () => void;
}

export default function Step1Form({ onNext }: Step1FormProps) {
  const [role, setRole] = useState<"trainee" | "mentor">("mentor");
  const [expertises, setExpertises] = useState<string[]>(["Project Management"]);

  const expertiseOptions = [
    "Leadership", "Programming", "Design", "Marketing",
    "Data Science", "Business", "Project Management", "Communication",
  ];

  const toggleExpertise = (option: string) => {
    if (expertises.includes(option)) {
      setExpertises(expertises.filter((item) => item !== option));
    } else {
      setExpertises([...expertises, option]);
    }
  };

  return (
    <div className="fade-in flex flex-col gap-6">
      {/* Avatar & Name */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative shrink-0">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-700/50">
            <FontAwesomeIcon icon={faUser} className="h-8 w-8 text-slate-400" />
          </div>
          <button
            title="Upload Avatar"
            type="button"
            className="absolute bottom-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-primary ring-2 ring-card hover:bg-primary-hover"
          >
            <FontAwesomeIcon icon={faPlus} className="h-3 w-3 text-white" />
          </button>
        </div>
        
        <div className="w-full flex-1">
          <label className="label text-xs text-slate-400">Full Name</label>
          <input
            type="text"
            className="input"
            defaultValue="Bui Quang Hung"
            placeholder="Enter your full name"
          />
        </div>
      </div>

      {/* Role Selection */}
      <div>
        <label className="label text-xs text-slate-400">I am joining as:</label>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setRole("trainee")}
            className={`flex flex-col items-center justify-center gap-2 rounded-xl border p-4 transition-all duration-200 ${
              role === "trainee"
                ? "border-primary bg-primary text-white"
                : "border-transparent bg-slate-700/40 text-slate-300 hover:bg-slate-700/60"
            }`}
          >
            <FontAwesomeIcon icon={faGraduationCap} className={`h-8 w-8 ${role === "trainee" ? "text-white" : "text-yellow-500"}`} />
            <div className="text-center">
              <div className="font-semibold">Trainee</div>
              <div className={`text-xs ${role === "trainee" ? "text-white/80" : "text-slate-400"}`}>
                I want to find mentors
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setRole("mentor")}
            className={`flex flex-col items-center justify-center gap-2 rounded-xl border p-4 transition-all duration-200 ${
              role === "mentor"
                ? "border-primary bg-primary text-white"
                : "border-transparent bg-slate-700/40 text-slate-300 hover:bg-slate-700/60"
            }`}
          >
            <FontAwesomeIcon icon={faPersonChalkboard} className={`h-8 w-8 ${role === "mentor" ? "text-white" : "text-cyan-400"}`} />
            <div className="text-center">
              <div className="font-semibold">Mentor</div>
              <div className={`text-xs ${role === "mentor" ? "text-white/80" : "text-slate-400"}`}>
                I want to mentor others
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Bio */}
      <div>
        <label className="label text-xs text-slate-400">Bio</label>
        <textarea
          className="textarea"
          placeholder="Tell us a bit about yourself..."
        ></textarea>
      </div>

      {/* Areas of Expertise */}
      <div>
        <label className="label text-xs text-slate-400">Areas of expertise</label>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {expertiseOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => toggleExpertise(option)}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                expertises.includes(option)
                  ? "bg-slate-600 text-white"
                  : "bg-slate-800/50 text-slate-300 hover:bg-slate-700"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Professional Skills */}
      <div>
        <label className="label text-xs text-slate-400">Professional skills</label>
        <input
          type="text"
          className="input"
          placeholder="e.g. JavaScript, Project Management, Research"
        />
      </div>

      {/* Industry Experience */}
      <div>
        <label className="label text-xs text-slate-400">Industry experience</label>
        <input
          type="text"
          className="input"
          placeholder="e.g. 5 years in Tech, 3 years in Finance"
        />
      </div>

      {/* Action Buttons */}
      <div className="mt-4 flex gap-4">
        <button type="button" className="btn bg-slate-700 text-white hover:bg-slate-600 sm:w-32">
          Back
        </button>
        <button type="button" onClick={onNext} className="btn btn-primary flex-1">
          {/* Continue to Next Step */}
          Complete Registration 
        </button>
      </div>
    </div>
  );
}