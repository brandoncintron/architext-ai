/**
 * @file This hook manages the state and logic for the multi-step wizard.
 */
import { useMemo, useState } from "react";

import { generatePlan, generateTdd } from "@/components/wizard/actions/actions";
import { InitialIdeaFormValues } from "@/components/wizard/initial-idea/utils/schema";
import { Question } from "@/components/wizard/types/types";

export const useWizard = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialFormValues, setInitialFormValues] =
    useState<InitialIdeaFormValues | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<(string | string[] | null)[]>([]);
  const [finalClarification, setFinalClarification] = useState("");
  const [generatedTDD, setGeneratedTDD] = useState("");

  const totalSteps = useMemo(() => questions.length + 3, [questions.length]);

  const goToNextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps - 1));
  };

  const goToPreviousStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleInitialSubmit = async (values: InitialIdeaFormValues) => {
    setIsLoading(true);
    setError(null);
    setInitialFormValues(values);
    try {
      const data = await generatePlan(values);
      setQuestions(data.questions);
      setAnswers(new Array(data.questions.length).fill(null));
      goToNextStep();
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError(
          "An error occurred while generating questions. Please try again.",
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerSelect = (questionIndex: number, option: string) => {
    setAnswers((prevAnswers) => {
      const newAnswers = [...prevAnswers];
      const question = questions[questionIndex];

      if (question.type === "multi-choice") {
        const currentSelection =
          (newAnswers[questionIndex] as string[] | null) || [];
        const selectionSet = new Set(currentSelection);
        if (selectionSet.has(option)) {
          selectionSet.delete(option);
        } else {
          selectionSet.add(option);
        }
        newAnswers[questionIndex] = Array.from(selectionSet);
      } else {
        newAnswers[questionIndex] = option;
      }
      return newAnswers;
    });
  };

  const handleGenerateTDD = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await generateTdd({
        initialFormValues,
        questions,
        answers,
        finalClarification,
      });
      setGeneratedTDD(data.tdd);
      goToNextStep();
    } catch (error) {
      console.error(error);
      setError("An error occurred while generating the TDD. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartOver = () => {
    setCurrentStep(0);
    setInitialFormValues(null);
    setQuestions([]);
    setAnswers([]);
    setFinalClarification("");
    setGeneratedTDD("");
    setIsLoading(false);
  };

  const isLastStep = currentStep === totalSteps - 1;
  const isFirstStep = currentStep === 0;
  const finalClarificationStepIndex = 1 + questions.length;
  const isFinalClarificationStep = currentStep === finalClarificationStepIndex;
  const isGenerating = isFinalClarificationStep && isLoading;

  return {
    currentStep,
    isLoading,
    questions,
    error,
    answers,
    finalClarification,
    setFinalClarification,
    generatedTDD,
    handleInitialSubmit,
    handleAnswerSelect,
    handleGenerateTDD,
    handleStartOver,
    goToPreviousStep,
    goToNextStep,
    isLastStep,
    isFirstStep,
    isFinalClarificationStep,
    isGenerating,
    totalSteps,
  };
};
