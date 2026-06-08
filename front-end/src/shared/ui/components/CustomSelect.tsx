import React, { useState, useEffect, useRef } from "react";

interface CustomSelectProps<T> {
  options: T[];
  value: string | number;
  onChange: (value: any) => void;
  getLabel: (option: T) => string;
  getValue: (option: T) => string | number;
  placeholder?: string;
  disabled?: boolean;
}

export const CustomSelect = <T,>({
  options,
  value,
  onChange,
  getLabel,
  getValue,
  placeholder = "Select an option",
  disabled,
}: CustomSelectProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedItemRef = useRef<HTMLLIElement>(null);

  const selectedOption = options.find((opt) => getValue(opt) === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen) {
      selectedItemRef.current?.scrollIntoView({
        block: "center",
      });
    }
  }, [isOpen]);

  return (
    <div className="relative w-full" ref={containerRef}>
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`select flex items-center justify-between cursor-pointer select-none transition-all duration-200
          ${disabled ? "opacity-50 pointer-events-none" : ""}
          ${isOpen ? "border-primary ring-2 ring-orange-500/20" : ""}`}
      >
        <span className={selectedOption ? "text-white" : "text-slate-400"}>
          {selectedOption ? getLabel(selectedOption) : placeholder}
        </span>

        <svg
          className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180 text-primary" : ""}`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
        </svg>
      </div>

      {isOpen && options.length > 0 && (
        <ul className="absolute z-50 mt-2 w-full max-h-60 overflow-y-auto rounded-xl border border-border bg-card p-1.5 shadow-2xl shadow-black/60 backdrop-blur-sm slide-up">
          {options.map((option, index) => {
            const currentOptionValue = getValue(option);
            const isSelected = currentOptionValue === value;

            return (
              <li
                ref={isSelected ? selectedItemRef : null}
                key={index}
                onClick={() => {
                  onChange(currentOptionValue);
                  setIsOpen(false);
                }}
                className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium cursor-pointer transition-all duration-150 my-0.5
                  ${isSelected
                    ? "bg-primary text-white"
                    : "text-slate-300 hover:bg-sidebar-hover hover:text-white"
                  }`}
              >
                <span>{getLabel(option)}</span>

                {isSelected && (
                  <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};