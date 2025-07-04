/**
 * @file This component manages and renders the multi-step wizard interface.
 */
"use client";

import { InitialIdeaStep } from "./initial-idea/initial-idea-step";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ArrowRight,
  Loader2,
  Check,
} from "lucide-react";
import { QuestionStep } from "./question-step";
import { FinalClarificationStep } from "./final-clarification-step";
import { ResultsStep } from "./results-step";
import { GoogleGeminiLogo } from "../ui/google-gemini-logo";
import {
  Card,
  CardFooter,
} from "@/components/ui/card";
import { useWizard } from "./hooks/use-wizard";
import ErrorAlert from "../ui/error-alert";

export const Wizard = () => {
  const {
    currentStep,
    isLoading,
    questions,
    error,
    answers,
    finalClarification,
    setFinalClarification,
    generatedTDD,
    handleInitialSubmit,
    handleAnswerSelect,
    handleGenerateTDD,
    handleStartOver,
    goToPreviousStep,
    goToNextStep,
    isLastStep,
    isFirstStep,
    isFinalClarificationStep,
    isGenerating,
  } = useWizard();

  // Renders the steps for the wizard
  const steps = [
    {
      name: "Initial Idea",
      component: (
        <InitialIdeaStep
          onSubmit={handleInitialSubmit}
          isSubmitting={isLoading}
        />
      ),
    },
    ...questions.map((q, index) => ({
      name: `Question ${index + 1}`,
      component: (
        <QuestionStep
          question={q.question}
          options={q.options}
          selection={answers[index]}
          onSelectionChange={(option) => handleAnswerSelect(index, option)}
        />
      ),
    })),
    {
      name: "Final Clarification",
      component: (
        <FinalClarificationStep
          value={finalClarification}
          onChange={setFinalClarification}
        />
      ),
    },
    {
      name: "Results",
      component: <ResultsStep tdd={generatedTDD} onStartOver={handleStartOver} />,
    },
  ];

  const CurrentComponent = steps[currentStep].component;

  return (
    <div className="flex w-full flex-col items-center justify-center">

      <div>
        <ErrorAlert error={error || ""} />
      </div>

      {/* Step indicator */}
      {!isFirstStep && (
        <div className="flex justify-center pt-12 mt-14 md:mt-0">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground sm:space-x-2">
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
                  {currentStep > index ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    index + 1
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className="h-px w-4 bg-muted sm:w-12" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex w-full min-h-[420px] max-w-4xl items-center justify-center p-4 relative">
      <div className="absolute left-[-5rem] -z-10 h-[28.5rem] w-128 rounded-full bg-blue-500/40 blur-3xl lg:left-[5rem]" />
      
        {(isLoading && isFirstStep) || isGenerating ? (
          <div className="flex flex-col items-center gap-4 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            {isGenerating ? (
              <div className="font-sans flex flex-col gap-4 items-center">
                <p>The AI is generating your TDD, please wait...</p>
                <GoogleGeminiLogo />
              </div>
            ) : (
              <p className="text-muted-foreground">Analyzing your idea...</p>
            )}
          </div>
        ) : isFirstStep || isLastStep ? (
          CurrentComponent
        ) : (
          <Card className="w-full max-w-2xl flex flex-col">
            
            {CurrentComponent}
            <CardFooter className="flex justify-between mt-auto">
              <Button
                variant="outline"
                onClick={goToPreviousStep}
                size="icon"
                disabled={currentStep === 1}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="default"
                onClick={
                  isFinalClarificationStep ? handleGenerateTDD : goToNextStep
                }
                disabled={
                  (currentStep > 0 &&
                    !answers[currentStep - 1] &&
                    !isFinalClarificationStep) ||
                  isLastStep
                }
                size={isFinalClarificationStep ? "default" : "icon"}
              >
                {isFinalClarificationStep ? (
                  "Generate TDD"
                ) : (
                  <ArrowRight className="h-4 w-4" />
                )}
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
}; 
