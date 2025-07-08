/**
 * @file This component manages and renders the multi-step wizard interface.
 */
"use client";

import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardFooter } from "@/components/ui/card";
import ErrorAlert from "@/components/ui/error-alert";
import { GoogleGeminiLogo } from "@/components/ui/google-gemini-logo";
import { FinalClarificationStep } from "@/components/wizard/final-clarification-step";
import { useWizard } from "@/components/wizard/hooks/use-wizard";
import { InitialIdeaStep } from "@/components/wizard/initial-idea/initial-idea-step";
import { ProgressBar } from "@/components/wizard/progress-bar";
import { QuestionStep } from "@/components/wizard/question-step";
import { ResultsStep } from "@/components/wizard/results/results-step";

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
      component: (
        <ResultsStep tdd={generatedTDD} onStartOver={handleStartOver} />
      ),
    },
  ];

  const CurrentComponent = steps[currentStep].component;

  if (isLastStep) {
    return CurrentComponent;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center md:px-24">
      <div className="flex w-full flex-col items-center justify-center">
        <div>
          <ErrorAlert error={error || ""} />
        </div>

        <div className="flex w-full min-h-[400px] max-w-4xl justify-center items-center p-4 relative">
          <div className="absolute left-[-8rem] -z-10 h-[28.5rem] w-128 rounded-full bg-blue-500/40 blur-3xl md:left-[5rem]" />

          {(isLoading && isFirstStep) || isGenerating ? (
            <div className="flex flex-col items-center gap-4 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              {isGenerating ? (
                <div className="font-sans flex flex-col gap-4 items-center">
                  <p>Generating your TDD, please wait...</p>
                  <GoogleGeminiLogo />
                </div>
              ) : (
                <p className="text-muted-foreground">Analyzing your idea...</p>
              )}
            </div>
          ) : isFirstStep ? (
            CurrentComponent
          ) : (
            <Card className="w-full max-w-2xl flex flex-col">
              {!isFirstStep && (
                <ProgressBar steps={steps} currentStep={currentStep} />
              )}
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
                      !isFinalClarificationStep)
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
    </main>
  );
};
