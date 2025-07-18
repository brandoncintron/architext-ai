/**
 * @file This component manages and renders the multi-step wizard interface.
 */
"use client";

import React from "react";

import { RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ErrorAlert from "@/components/ui/error-alert";
import { useWizard } from "@/components/wizard/hooks/use-wizard";
import { LoadingIndicator } from "@/components/wizard/loading-indicator";
import { ProgressBar } from "@/components/wizard/progress-bar";
import { StepRouter } from "@/components/wizard/step-router";
import { models } from "@/components/wizard/utils/constants";
import { getStepTypeInfo, isCurrentQuestionUnanswered } from "@/components/wizard/utils/step-validation";
import { WizardFooter } from "@/components/wizard/wizard-footer";

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
    isFirstStep,
    isModelSelectionStep,
    isFinalClarificationStep,
    isGenerating,
    isBackButtonDisabled,
    progressiveMessageIndex,
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

      {stepTypeInfo.isQuestionStep && (
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
            progressiveMessageIndex={progressiveMessageIndex}
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
