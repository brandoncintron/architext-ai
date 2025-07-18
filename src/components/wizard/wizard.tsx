/**
 * @file This component manages and renders the multi-step wizard interface.
 */
"use client";

import React, { useMemo } from "react";

import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardFooter } from "@/components/ui/card";
import ErrorAlert from "@/components/ui/error-alert";
import { GoogleGeminiLogo } from "@/components/ui/google-gemini-logo";
import { FinalClarificationStep } from "@/components/wizard/final-clarification-step";
import { useWizard } from "@/components/wizard/hooks/use-wizard";
import { InitialIdeaStep } from "@/components/wizard/initial-idea/initial-idea-step";
import { ModelSelectionStep } from "@/components/wizard/model-selection-step";
import { ProgressBar } from "@/components/wizard/progress-bar";
import { QuestionStep } from "@/components/wizard/question-step";
import { ResultsStep } from "@/components/wizard/results/results-step";
import {
  LoadingIndicatorProps,
  WizardFooterProps,
} from "@/components/wizard/types/types";
import { models } from "@/components/wizard/utils/constants";

const LoadingIndicator = ({
  isGenerating,
  selectedModel,
}: LoadingIndicatorProps) => {
  const isProModel = selectedModel === "gemini-2.5-pro";

  const proModelMessage = isGenerating ? (
    <div className="flex flex-col gap-2">
      <span>Generating your TDD, please wait...</span>
      <span className="text-xs text-muted-foreground">
        Gemini 2.5 Pro requires more time to generate a TDD.
      </span>
    </div>
  ) : (
    <div className="flex flex-col gap-2">
      <span>Analyzing your idea...</span>
      <span className="text-xs text-muted-foreground">
        Gemini 2.5 Pro requires more time to analyze your idea.
      </span>
    </div>
  );

  const standardMessage = isGenerating
    ? "Generating your TDD, please wait...."
    : "Analyzing your idea....";

  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <div className="font-sans flex flex-col gap-4 items-center cursor-default">
        <p>{isProModel ? proModelMessage : standardMessage}</p>
        {isGenerating && <GoogleGeminiLogo />}
      </div>
    </div>
  );
};

const WizardFooter = ({
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
    selectedModel,
    steps,
    handleInitialSubmit,
    handleModelSelect,
    handleGeneratePlan,
    handleAnswerSelect,
    handleGenerateTDD,
    handleStartOver,
    goToPreviousStep,
    goToNextStep,
    isLastStep,
    isFirstStep,
    isModelSelectionStep,
    isFinalClarificationStep,
    isGenerating,
    isBackButtonDisabled,
  } = useWizard();

  const stepComponents = useMemo(
    () => ({
      "initial-idea": (
        <InitialIdeaStep
          onSubmit={handleInitialSubmit}
          isSubmitting={isLoading}
        />
      ),
      "model-selection": (
        <ModelSelectionStep
          onSelectModel={handleModelSelect}
          selectedModel={selectedModel}
        />
      ),
      ...questions.reduce(
        (acc, q, index) => {
          acc[`question-${index}`] = (
            <QuestionStep
              question={q.question}
              options={q.options}
              type={q.type}
              selection={answers[index]}
              onSelectionChange={(option) => handleAnswerSelect(index, option)}
            />
          );
          return acc;
        },
        {} as Record<string, React.ReactNode>,
      ),
      "final-clarification": (
        <FinalClarificationStep
          value={finalClarification}
          onChange={setFinalClarification}
        />
      ),
      results: (
        <ResultsStep
          tdd={generatedTDD}
          onStartOver={handleStartOver}
          selectedModel={selectedModel}
          models={models}
        />
      ),
    }),
    [
      answers,
      finalClarification,
      generatedTDD,
      handleAnswerSelect,
      handleInitialSubmit,
      handleModelSelect,
      handleStartOver,
      isLoading,
      questions,
      selectedModel,
      setFinalClarification,
    ],
  );

  const currentStepData = steps[currentStep];
  const CurrentComponent =
    stepComponents[currentStepData?.id as keyof typeof stepComponents];

  const questionStepIndex = currentStep - 2;
  const currentAnswer = answers[questionStepIndex];
  const isCurrentQuestionUnanswered =
    currentAnswer === null ||
    (Array.isArray(currentAnswer) && currentAnswer.length === 0);

  const isQuestionStep = currentStepData?.id.startsWith("question-");

  if (isLastStep) {
    return CurrentComponent;
  }

  const progressBarSteps = steps.filter((step) =>
    step.id.startsWith("question-"),
  );
  const currentProgressStep = progressBarSteps.findIndex(
    (step) => step.id === currentStepData?.id,
  );

  return (
    <div className="flex w-full flex-col items-center p-4 md:p-0">
      <div className="w-full max-w-2xl">
        <ErrorAlert error={error || ""} />
      </div>

      <div className="flex w-full max-w-4xl justify-center items-center relative">
        <div className="absolute left-[-8rem] -z-10 h-[28.5rem] w-128 rounded-full bg-blue-500/40 blur-3xl md:left-[5rem]" />
        {isLoading && (isModelSelectionStep || isGenerating) ? (
          <LoadingIndicator
            isGenerating={isGenerating}
            selectedModel={selectedModel}
          />
        ) : (
          <Card className="w-full h-full min-h-[350px] max-w-2xl flex flex-col whitespace-normal">
            {currentProgressStep !== -1 && (
              <ProgressBar
                steps={progressBarSteps}
                currentStep={currentProgressStep}
              />
            )}
            {CurrentComponent}
            {!isFirstStep && (
              <WizardFooter
                isLoading={isLoading}
                isModelSelectionStep={isModelSelectionStep}
                isFinalClarificationStep={isFinalClarificationStep}
                isQuestionStep={isQuestionStep}
                isCurrentQuestionUnanswered={isCurrentQuestionUnanswered}
                selectedModel={selectedModel}
                isBackButtonDisabled={isBackButtonDisabled}
                models={models}
                goToPreviousStep={goToPreviousStep}
                handleGeneratePlan={handleGeneratePlan}
                handleGenerateTDD={handleGenerateTDD}
                goToNextStep={goToNextStep}
              />
            )}
          </Card>
        )}
      </div>
    </div>
  );
};
