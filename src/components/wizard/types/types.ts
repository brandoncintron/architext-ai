import { InitialIdeaFormValues } from "@/components/wizard/initial-idea/utils/schema";
import { models } from "@/components/wizard/utils/constants";

type ModelInfo = typeof models[number];

// step-router.tsx
export interface StepData {
  id: string;
  name: string;
}

export interface StepRouterProps {
  currentStepData: StepData;
  questions: Question[];
  answers: (string | string[] | null)[];
  finalClarification: string;
  setFinalClarification: (value: string) => void;
  generatedTDD: string;
  selectedModel: Model | null;
  models: readonly ModelInfo[];
  isLoading: boolean;
  onInitialSubmit: (values: InitialIdeaFormValues) => void;
  onModelSelect: (model: Model) => void;
  onAnswerSelect: (questionIndex: number, option: string) => void;
  onStartOver: () => void;
}

// results-step.tsx
export interface ResultsStepProps {
  tdd: string;
  onStartOver: () => void;
  selectedModel: Model | null;
  models: readonly ModelInfo[];
}

// question-step.tsx
export interface QuestionStepProps {
  question: string;
  options: string[];
  type: "single-choice" | "multi-choice";
  selection: string | string[] | null;
  onSelectionChange: (option: string) => void;
}

// progress-bar.tsx
export interface Step {
  name: string;
}

export interface ProgressBarProps {
  steps: Step[];
  currentStep: number;
}

// final-clarification-step.tsx
export interface FinalClarificationStepProps {
  value: string;
  onChange: (value: string) => void;
}

// initial-idea-step.tsx
export interface InitialIdeaStepProps {
  onSubmit: (values: InitialIdeaFormValues) => void;
  isSubmitting: boolean;
}

// model-selection-step.tsx
export type Model = (typeof models)[number]["name"];

export interface ModelSelectionStepProps {
  onSelectModel: (model: Model) => void;
  selectedModel: Model | null;
}

// wizard.tsx
export interface WizardFooterProps {
  isLoading: boolean;
  isModelSelectionStep: boolean;
  isFinalClarificationStep: boolean;
  isQuestionStep: boolean;
  isCurrentQuestionUnanswered: boolean;
  selectedModel: Model | null;
  isBackButtonDisabled: boolean;
  models: readonly ModelInfo[];
  goToPreviousStep: () => void;
  handleGenerateQuestions: () => void;
  handleGenerateTDD: () => void;
  goToNextStep: () => void;
}

// loading-indicator.tsx
export interface LoadingIndicatorProps {
  isGenerating: boolean;
  selectedModel: Model | null;
  cycleMessageIndex: number;
}

// use-wizard.tsx
export type Question = {
  type: "single-choice" | "multi-choice";
  question: string;
  options: string[];
};

export type GenerateTddPayload = {
  initialFormValues: InitialIdeaFormValues | null;
  questions: Question[];
  answers: (string | string[] | null)[];
  finalClarification: string;
  model: Model | null;
};