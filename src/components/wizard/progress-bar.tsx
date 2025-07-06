/**
 * @file This component renders the progress bar for the wizard.
 */
import { Check } from "lucide-react";

interface Step {
  name: string;
}

interface ProgressBarProps {
  steps: Step[];
  currentStep: number;
}

export const ProgressBar = ({ steps, currentStep }: ProgressBarProps) => {
  return (
    <div className="flex justify-center w-full px-4 ">
      <div className="flex items-center space-x-1 text-sm text-muted-foreground sm:space-x-2">
        {steps.map((step, index) => (
          <div key={step.name} className="flex items-center sm:space-x-2">
            <div
              className={`flex h-6 w-6 items-center justify-center rounded-full ${
                currentStep > index
                  ? "bg-primary text-primary-foreground"
                  : currentStep === index
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              }`}
            >
              {currentStep > index ? <Check className="h-4 w-4" /> : index + 1}
            </div>
            {index < steps.length - 1 && (
              <div className="h-px w-4 bg-muted sm:w-12" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}; 