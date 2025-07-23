/**
 * @file This component renders the progress bar for the wizard.
 */
"use client";

import { Check, RotateCcw } from "lucide-react";

import { ProgressBarProps } from "@/components/wizard/types/types";
import { useIsMobile } from "@/hooks/use-mobile";

import { Button } from "../ui/button";

export const ProgressBar = ({
  steps,
  currentStep,
  handleStartOver,
}: ProgressBarProps) => {
  const isMobile = useIsMobile();

  const StartOverButton = (
    <Button
      variant="ghost"
      onClick={handleStartOver}
      size="sm"
      className="text-muted-foreground"
    >
      <RotateCcw className="h-4 w-4 mr-2" />
      <span className="text-xs md:text-sm">Start Over</span>
    </Button>
  );

  return (
    <div className="flex items-center justify-between w-full px-4">
      {isMobile ? (
        <div className="flex justify-start w-full">{StartOverButton}</div>
      ) : (
        <div className="flex flex-1 justify-start">{StartOverButton}</div>
      )}

      <div className="flex items-center space-x-0 text-sm text-muted-foreground cursor-default mr-4 md:mr-0">
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
      <div className="flex-1" />
    </div>
  );
};
