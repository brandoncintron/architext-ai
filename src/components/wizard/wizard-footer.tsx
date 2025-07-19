/**
 * @file Footer component for the wizard that handles navigation and action buttons.
 */

import { ArrowLeft, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { WizardFooterProps } from "@/components/wizard/types/types";

export const WizardFooter = ({
  isLoading,
  isModelSelectionStep,
  isFinalClarificationStep,
  isQuestionStep,
  isCurrentQuestionUnanswered,
  selectedModel,
  goToPreviousStep,
  handleGeneratePlan,
  handleGenerateTDD,
  goToNextStep,
  isBackButtonDisabled,
  models,
}: WizardFooterProps) => {
  const selectedModelTitle =
    models.find((m) => m.name === selectedModel)?.title || "";

  return (
    <CardFooter className="flex justify-between items-center mt-auto">
      {!isBackButtonDisabled ? (
        <Button variant="outline" onClick={goToPreviousStep} size="icon">
          <ArrowLeft className="h-4 w-4" />
        </Button>
      ) : (
        <div className="h-8 w-8" />
      )}

      {selectedModel && !isModelSelectionStep && (
        <div className="flex flex-col items-center text-xs text-muted-foreground md:flex-row md:gap-1 px-2">
          <span>Selected Model:</span>
          <span className="font-semibold md:font-normal">
            {selectedModelTitle}
          </span>
        </div>
      )}

      {isModelSelectionStep ? (
        <Button
          variant="default"
          onClick={handleGeneratePlan}
          disabled={!selectedModel || isLoading}
          size="default"
        >
          {isLoading ? "Generating..." : "Start Building"}
        </Button>
      ) : (
        <Button
          variant="default"
          onClick={isFinalClarificationStep ? handleGenerateTDD : goToNextStep}
          disabled={
            (isQuestionStep && isCurrentQuestionUnanswered) || isLoading
          }
          size={isFinalClarificationStep ? "default" : "icon"}
        >
          {isFinalClarificationStep ? (
            "Generate TDD"
          ) : (
            <ArrowRight className="h-4 w-4" />
          )}
        </Button>
      )}
    </CardFooter>
  );
};
