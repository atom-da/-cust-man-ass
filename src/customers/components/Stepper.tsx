interface StepperProps {
  step: number;
}

const steps = ["Personal Info", "Address Info", "Review"];

export default function Stepper({ step }: StepperProps) {
  return (
    <div className="mb-8 flex items-center">
      {steps.map((label, index) => {
        const done = index < step;
        const active = index === step;

        return (
          <div key={label} className="flex flex-1 items-center">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition-colors
                  ${done ? "bg-blue-600 text-white" : active ? "border-2 border-blue-600 text-blue-600" : "border-2 border-gray-300 text-gray-400"}`}
              >
                {done ? "✓" : index + 1}
              </div>
              <span
                className={`text-xs font-medium ${active ? "text-blue-600" : done ? "text-gray-700" : "text-gray-400"}`}
              >
                {label}
              </span>
            </div>

            {index !== steps.length - 1 && (
              <div
                className={`mb-5 mx-2 h-px flex-1 ${index < step ? "bg-blue-600" : "bg-gray-200"}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
