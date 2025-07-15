import { InitialIdeaFormValues } from "@/components/wizard/initial-idea/utils/schema";

// results-step.tsx
export interface ResultsStepProps {
  tdd: string;
  onStartOver: () => void;
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

// use-wizard.tsx
export type Question = {
  type: "single-choice" | "multi-choice";
  question: string;
  options: string[];
};
