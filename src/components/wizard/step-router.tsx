/**
 * @file StepRouter component that handles the routing logic for wizard steps
 */
import React from "react";

import { FinalClarificationStep } from "@/components/wizard/final-clarification-step";
import { InitialIdeaStep } from "@/components/wizard/initial-idea/initial-idea-step";
import { ModelSelectionStep } from "@/components/wizard/model-selection-step";
import { QuestionStep } from "@/components/wizard/question-step";
import { ResultsStep } from "@/components/wizard/results/results-step";
import { StepRouterProps } from "@/components/wizard/types/types";

/**
 * Individual step wrapper components for cleaner organization
 */
const InitialIdeaStepWrapper: React.FC<{
  onSubmit: StepRouterProps["onInitialSubmit"];
  isSubmitting: boolean;
}> = ({ onSubmit, isSubmitting }) => (
  <InitialIdeaStep onSubmit={onSubmit} isSubmitting={isSubmitting} />
);

const ModelSelectionStepWrapper: React.FC<{
  onSelectModel: StepRouterProps["onModelSelect"];
  selectedModel: StepRouterProps["selectedModel"];
}> = ({ onSelectModel, selectedModel }) => (
  <ModelSelectionStep
    onSelectModel={onSelectModel}
    selectedModel={selectedModel}
  />
);

const QuestionStepWrapper: React.FC<{
  questionIndex: number;
  question: StepRouterProps["questions"][0];
  answer: StepRouterProps["answers"][0];
  onAnswerSelect: StepRouterProps["onAnswerSelect"];
}> = ({ questionIndex, question, answer, onAnswerSelect }) => (
  <QuestionStep
    question={question.question}
    options={question.options}
    type={question.type}
    selection={answer}
    onSelectionChange={(option) => onAnswerSelect(questionIndex, option)}
  />
);

const FinalClarificationStepWrapper: React.FC<{
  value: string;
  onChange: (value: string) => void;
}> = ({ value, onChange }) => (
  <FinalClarificationStep value={value} onChange={onChange} />
);

const ResultsStepWrapper: React.FC<{
  tdd: string;
  onStartOver: () => void;
  selectedModel: StepRouterProps["selectedModel"];
  models: StepRouterProps["models"];
}> = ({ tdd, onStartOver, selectedModel, models }) => (
  <ResultsStep
    tdd={tdd}
    onStartOver={onStartOver}
    selectedModel={selectedModel}
    models={models}
  />
);

/**
 * Registry mapping step IDs to their corresponding components
 */
const stepComponentRegistry = {
  "initial-idea": InitialIdeaStepWrapper,
  "model-selection": ModelSelectionStepWrapper,
  "question": QuestionStepWrapper,
  "final-clarification": FinalClarificationStepWrapper,
  results: ResultsStepWrapper,
} as const;

/**
 * Determines the step type and extracts question index for question steps
 */
const parseStepId = (stepId: string): { type: keyof typeof stepComponentRegistry; questionIndex?: number } => {
  if (stepId.startsWith("question-")) {
    const questionIndex = parseInt(stepId.split("-")[1], 10);
    return { type: "question", questionIndex };
  }
  
  if (stepId in stepComponentRegistry) {
    return { type: stepId as keyof typeof stepComponentRegistry };
  }
  
  throw new Error(`Unknown step ID: ${stepId}`);
};

/**
 * StepRouter component that renders the appropriate step based on current step data
 */
export const StepRouter: React.FC<StepRouterProps> = ({
  currentStepData,
  questions,
  answers,
  finalClarification,
  setFinalClarification,
  generatedTDD,
  selectedModel,
  models,
  isLoading,
  onInitialSubmit,
  onModelSelect,
  onAnswerSelect,
  onStartOver,
}) => {
  const { type, questionIndex } = parseStepId(currentStepData.id);
  
  switch (type) {
    case "initial-idea":
      return (
        <InitialIdeaStepWrapper
          onSubmit={onInitialSubmit}
          isSubmitting={isLoading}
        />
      );
      
    case "model-selection":
      return (
        <ModelSelectionStepWrapper
          onSelectModel={onModelSelect}
          selectedModel={selectedModel}
        />
      );
      
    case "question":
      if (questionIndex === undefined || !questions[questionIndex]) {
        throw new Error(`Invalid question index: ${questionIndex}`);
      }
      return (
        <QuestionStepWrapper
          questionIndex={questionIndex}
          question={questions[questionIndex]}
          answer={answers[questionIndex]}
          onAnswerSelect={onAnswerSelect}
        />
      );
      
    case "final-clarification":
      return (
        <FinalClarificationStepWrapper
          value={finalClarification}
          onChange={setFinalClarification}
        />
      );
      
    case "results":
      return (
        <ResultsStepWrapper
          tdd={generatedTDD}
          onStartOver={onStartOver}
          selectedModel={selectedModel}
          models={models}
        />
      );
      
    default:
      throw new Error(`Unhandled step type: ${type}`);
  }
}; 