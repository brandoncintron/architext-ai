/**
 * @file This component manages and renders the multi-step wizard interface.
 */
"use client";

import React, { useMemo } from "react";

import { RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ErrorAlert from "@/components/ui/error-alert";
import { useWizard } from "@/components/wizard/hooks/use-wizard";
import { LoadingIndicator } from "@/components/wizard/loading-indicator";
import { ProgressBar } from "@/components/wizard/progress-bar";
import { FinalClarificationStep } from "@/components/wizard/steps/final-clarification-step";
import { InitialIdeaStep } from "@/components/wizard/steps/initial-idea/initial-idea-step";
import { ModelSelectionStep } from "@/components/wizard/steps/model-selection-step";
import { QuestionStep } from "@/components/wizard/steps/question-step";
import { ResultsStep } from "@/components/wizard/steps/results/results-step";
import { models } from "@/components/wizard/utils/constants";
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
    handleGenerateQuestions,
    handleAnswerSelect,
    handleGenerateTDD,
    goToPreviousStep,
    goToNextStep,
    isLastStep,
    isFirstStep,
    isModelSelectionStep,
    isFinalClarificationStep,
    isGenerating,
    isBackButtonDisabled,
    cycleMessageIndex,
  } = useWizard();

  const stepComponents = useMemo(() => {
    const stepComponentsMap: Record<string, React.ReactNode> = {
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
      "final-clarification": (
        <FinalClarificationStep
          value={finalClarification}
          onChange={setFinalClarification}
        />
      ),
      results: (
        <ResultsStep
          tdd={generatedTDD}
          selectedModel={selectedModel}
          models={models}
        />
      ),
    };

    for (let index = 0; index < questions.length; index++) {
      const q = questions[index];
      stepComponentsMap[`question-${index}`] = (
        <QuestionStep
          question={q.question}
          options={q.options}
          type={q.type}
          selection={answers[index]}
          onSelectionChange={(option) => handleAnswerSelect(index, option)}
        />
      );
    }

    return stepComponentsMap;
  }, [
    answers,
    finalClarification,
    generatedTDD,
    handleAnswerSelect,
    handleInitialSubmit,
    handleModelSelect,
    isLoading,
    questions,
    selectedModel,
    setFinalClarification,
  ]);

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
    <div className="flex w-full flex-col items-center p-4 md:p-0 max-w-2xl">
      <div className="w-full">
        <ErrorAlert error={error || ""} />
      </div>

      {isQuestionStep && (
        <div className="flex items-end justify-end w-full mb-2">
          <Button
            onClick={() => {
              window.location.reload();
            }}
            size={"sm"}
          >
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
