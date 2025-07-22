import { InitialIdeaFormValues } from "@/components/wizard/steps/initial-idea/utils/schema";
import { models } from "@/components/wizard/utils/constants";

type ModelInfo = typeof models[number];

// results-step.tsx
export interface ResultsStepProps {
  tdd: string;
  selectedModel: Model;
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
  selectedModel: Model;
}

// wizard.tsx
export interface WizardFooterProps {
  isLoading: boolean;
  isModelSelectionStep: boolean;
  isFinalClarificationStep: boolean;
  isQuestionStep: boolean;
  isCurrentQuestionUnanswered: boolean;
  selectedModel: Model;
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
  selectedModel: Model
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
  model: Model;
};