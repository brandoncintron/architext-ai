/**
 * @file Step validation utilities to handle business logic for wizard steps
 */
import { Question, StepData } from "@/components/wizard/types/types";

/**
 * Validates if a question step answer is complete
 */
export const isQuestionAnswerComplete = (
  answer: string | string[] | null,
  questionType: Question["type"]
): boolean => {
  if (answer === null) return false;
  
  if (questionType === "multi-choice") {
    return Array.isArray(answer) && answer.length > 0;
  }
  
  return typeof answer === "string" && answer.length > 0;
};

/**
 * Determines if the current step is a question step
 */
export const isQuestionStep = (stepId: string): boolean => {
  return stepId.startsWith("question-");
};

/**
 * Extracts question index from a question step ID
 */
export const getQuestionIndex = (stepId: string): number => {
  if (!isQuestionStep(stepId)) {
    throw new Error(`Step ID ${stepId} is not a question step`);
  }
  
  const index = parseInt(stepId.split("-")[1], 10);
  
  if (isNaN(index)) {
    throw new Error(`Invalid question index in step ID: ${stepId}`);
  }
  
  return index;
};

/**
 * Checks if the current question step has an unanswered question
 */
export const isCurrentQuestionUnanswered = (
  currentStepData: StepData,
  questions: Question[],
  answers: (string | string[] | null)[]
): boolean => {
  if (!isQuestionStep(currentStepData.id)) {
    return false;
  }
  
  try {
    const questionIndex = getQuestionIndex(currentStepData.id);
    const question = questions[questionIndex];
    const answer = answers[questionIndex];
    
    if (!question) return true;
    
    return !isQuestionAnswerComplete(answer, question.type);
  } catch {
    return true;
  }
};

/**
 * Determines step type information
 */
export const getStepTypeInfo = (stepId: string) => {
  const isFirstStep = stepId === "initial-idea";
  const isModelSelectionStep = stepId === "model-selection";
  const isFinalClarificationStep = stepId === "final-clarification";
  const isResultsStep = stepId === "results";
  const isQuestionStepType = isQuestionStep(stepId);
  const isFirstQuestionStep = stepId === "question-0";
  
  return {
    isFirstStep,
    isModelSelectionStep,
    isFinalClarificationStep,
    isResultsStep,
    isQuestionStep: isQuestionStepType,
    isFirstQuestionStep,
  };
}; 