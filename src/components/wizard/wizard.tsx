/**
 * @file This component manages and renders the multi-step wizard interface.
 */
"use client";

import React from "react";

import { ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ErrorAlert from "@/components/ui/error-alert";
import { FinalClarificationStep } from "@/components/wizard/final-clarification-step";
import { useWizard } from "@/components/wizard/hooks/use-wizard";
import { InitialIdeaStep } from "@/components/wizard/initial-idea/initial-idea-step";
import { LoadingIndicator } from "@/components/wizard/loading-indicator";
import { ModelSelectionStep } from "@/components/wizard/model-selection-step";
import { ProgressBar } from "@/components/wizard/progress-bar";
import { QuestionStep } from "@/components/wizard/question-step";
import { ResultsStep } from "@/components/wizard/results/results-step";
import { WizardFooterProps } from "@/components/wizard/types/types";
import { models } from "@/components/wizard/utils/constants";

const WizardFooter = ({
  isLoading,
  isModelSelectionStep,
  isFinalClarificationStep,
  isQuestionStep,
  isCurrentQuestionUnanswered,
  selectedModel,
  goToPreviousStep,
  handleGenerateQuestions,
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
          onClick={handleGenerateQuestions}
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
    handleGenerateQuestions,
    handleAnswerSelect,
    handleGenerateTDD,
    handleStartOver,
    goToPreviousStep,
    goToNextStep,
    isFirstStep,
    isModelSelectionStep,
    isFinalClarificationStep,
    isGenerating,
    isBackButtonDisabled,
    cycleMessageIndex,
  } = useWizard();

  const currentStepData = steps[currentStep];
  const stepTypeInfo = getStepTypeInfo(currentStepData?.id || "");
  
  const isCurrentQuestionAnswerIncomplete = isCurrentQuestionUnanswered(
    currentStepData,
    questions,
    answers
  );

  // Early return for results step - render without card wrapper
  if (stepTypeInfo.isResultsStep) {
    return (
      <StepRouter
        currentStepData={currentStepData}
        questions={questions}
        answers={answers}
        finalClarification={finalClarification}
        setFinalClarification={setFinalClarification}
        generatedTDD={generatedTDD}
        selectedModel={selectedModel}
        models={models}
        isLoading={isLoading}
        onInitialSubmit={handleInitialSubmit}
        onModelSelect={handleModelSelect}
        onAnswerSelect={handleAnswerSelect}
        onStartOver={handleStartOver}
      />
    );
  }

  // Get steps for progress bar (only question steps)
  const progressBarSteps = steps.filter((step) =>
    step.id.startsWith("question-"),
  );
  const currentProgressStep = progressBarSteps.findIndex(
    (step) => step.id === currentStepData?.id,
  );

  return (
    <div className="flex w-full flex-col items-center p-4 md:p-0 max-w-2xl">
      <div className="w-full">
        <ErrorAlert error={error || ""} />
      </div>

      {isQuestionStep && (
        <div className="flex items-end justify-end w-full mb-2">
          <Button onClick={handleStartOver} size={"sm"}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Start Over
          </Button>
        </div>
      )}

      <div className="flex w-full max-w-4xl justify-center items-center relative">
        <div className="absolute left-[-8rem] -z-10 h-[28.5rem] w-128 rounded-full bg-blue-500/40 blur-3xl md:left-[5rem]" />
        
        {isLoading && (isModelSelectionStep || isGenerating) ? (
          <LoadingIndicator
            isGenerating={isGenerating}
            selectedModel={selectedModel}
            cycleMessageIndex={cycleMessageIndex}
          />
        ) : (
          <Card className="w-full min-h-[440px] md:min-h-full h-full max-w-2xl flex flex-col whitespace-normal">
            {currentProgressStep !== -1 && (
              <ProgressBar
                steps={progressBarSteps}
                currentStep={currentProgressStep}
              />
            )}
            
            <StepRouter
              currentStepData={currentStepData}
              questions={questions}
              answers={answers}
              finalClarification={finalClarification}
              setFinalClarification={setFinalClarification}
              generatedTDD={generatedTDD}
              selectedModel={selectedModel}
              models={models}
              isLoading={isLoading}
              onInitialSubmit={handleInitialSubmit}
              onModelSelect={handleModelSelect}
              onAnswerSelect={handleAnswerSelect}
              onStartOver={handleStartOver}
            />
            
            {!isFirstStep && (
              <WizardFooter
                isLoading={isLoading}
                isModelSelectionStep={isModelSelectionStep}
                isFinalClarificationStep={isFinalClarificationStep}
                isQuestionStep={stepTypeInfo.isQuestionStep}
                isCurrentQuestionUnanswered={isCurrentQuestionAnswerIncomplete}
                selectedModel={selectedModel}
                isBackButtonDisabled={isBackButtonDisabled}
                models={models}
                goToPreviousStep={goToPreviousStep}
                handleGenerateQuestions={handleGenerateQuestions}
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
