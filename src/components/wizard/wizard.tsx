/**
 * @file This component manages and renders the multi-step wizard interface.
 */
"use client";

import React, { useMemo } from "react";

import { ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";
import { ClimbingBoxLoader } from "react-spinners";

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

const AnimatedText = ({
  texts,
  currentIndex,
}: {
  texts: string[];
  currentIndex: number;
}) => (
  <div className="relative h-4 text-xs text-muted-foreground">
    {texts.map((text, index) => (
      <p
        key={text}
        className="absolute w-full transition-all duration-500 ease-in-out"
        style={{
          transform: `translateY(${(index - currentIndex) * 100}%)`,
          opacity: index === currentIndex ? 1 : 0,
        }}
      >
        {text}
      </p>
    ))}
  </div>
);

const LoadingIndicator = ({
  isGenerating,
  selectedModel,
  showLongLoadMessage,
}: LoadingIndicatorProps) => {
  const isProModel = selectedModel === "gemini-2.5-pro";

  const proModelMainMessage = isGenerating
    ? "Generating your TDD, please wait..."
    : "Analyzing your idea...";

  const proModelSubMessages = [
    isGenerating
      ? "Gemini 2.5 Pro requires additional time to generate a TDD. Please wait."
      : "Gemini 2.5 Pro requires additional time to analyze your idea. Please wait.",
    "Still generating a response, please wait...",
  ];

  const currentSubMessageIndex = showLongLoadMessage ? 1 : 0;

  const proModelMessage = (
    <div className="flex flex-col gap-2">
      <span>{proModelMainMessage}</span>
      <AnimatedText
        texts={proModelSubMessages}
        currentIndex={currentSubMessageIndex}
      />
    </div>
  );

  const standardMessage = isGenerating
    ? "Generating your TDD, please wait...."
    : "Analyzing your idea....";

  return (
    <div className="flex flex-col items-center  text-center">
      <ClimbingBoxLoader size={8} color="" />
      <div className="font-sans flex flex-col items-center cursor-default">
        <span>{isProModel ? proModelMessage : standardMessage}</span>
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
    showLongLoadMessage,
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
            showLongLoadMessage={showLongLoadMessage}
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
