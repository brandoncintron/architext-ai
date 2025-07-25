/**
 * @file This hook manages the state and logic for the multi-step wizard.
 */
import { useMemo, useState } from "react";

import createDOMPurify from "dompurify";

import {
  generateQuestions,
  generateTdd,
  validateIdea,
} from "@/components/wizard/actions/actions";
import { useCyclingIndex } from "@/components/wizard/hooks/use-cycling-index";
import { InitialIdeaFormValues } from "@/components/wizard/steps/initial-idea/utils/schema";
import { Model, Question } from "@/components/wizard/types/types";
import { models } from "@/components/wizard/utils/constants";

export const useWizard = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialFormValues, setInitialFormValues] =
    useState<InitialIdeaFormValues | null>(null);
  const [selectedModel, setSelectedModel] = useState<Model>(models[0].name);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<(string | string[] | null)[]>([]);
  const [finalClarification, setFinalClarification] = useState("");
  const [generatedTDD, setGeneratedTDD] = useState("");

  const { cycleMessageIndex } = useCyclingIndex({
    isLoading,
    selectedModel: selectedModel,
  });

  const steps = useMemo(() => {
    const dynamicQuestionSteps = questions.map((q, index) => ({
      id: `question-${index}`,
      name: `Question ${index + 1}`,
    }));

    return [
      { id: "initial-idea", name: "Initial Idea" },
      { id: "model-selection", name: "Model Selection" },
      ...dynamicQuestionSteps,
      { id: "final-clarification", name: "Final Clarification" },
      { id: "results", name: "Results" },
    ];
  }, [questions]);

  const totalSteps = steps.length;

  const goToNextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps - 1));
  };

  const goToPreviousStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleStartOver = () => {
    setCurrentStep(0);
    setInitialFormValues(null);
    setQuestions([]);
    setAnswers([]);
    setFinalClarification("");
    setGeneratedTDD("");
    setIsLoading(false);
    setSelectedModel("gemini-2.0-flash");
  };

  const handleInitialSubmit = async (values: InitialIdeaFormValues) => {
    setIsLoading(true);
    setError(null);
    try {
      const DOMPurify = createDOMPurify(window);
      const sanitizedValues = {
        ...values,
        idea: DOMPurify.sanitize(values.idea),
      };
      await validateIdea(sanitizedValues);
      setInitialFormValues(sanitizedValues);
      goToNextStep();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred during validation.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleModelSelect = (model: Model) => {
    setSelectedModel(model);
  };

  const handleGenerateQuestions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (!initialFormValues) {
        throw new Error("Initial values not found.");
      }
      const data = await generateQuestions({
        ...initialFormValues,
        model: selectedModel,
      });
      setQuestions(data.questions);
      setAnswers(new Array(data.questions.length).fill(null));
      goToNextStep();
    } catch (error) {
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
        model: selectedModel,
      });
      setGeneratedTDD(data.tdd);
      goToNextStep();
    } catch (error) {
      console.error("Error in handleGenerateTDD:", error);
      setError("An error occurred while generating the TDD. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const currentStepData = steps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;
  const isModelSelectionStep = currentStepData?.id === "model-selection";
  const isFinalClarificationStep =
    currentStepData?.id === "final-clarification";
  const isGenerating = isFinalClarificationStep && isLoading;
  const isFirstQuestionStep = currentStepData?.id === "question-0";
  const isBackButtonDisabled = isLoading || isFirstQuestionStep;

  return {
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
    isLastStep,
    isFirstStep,
    isModelSelectionStep,
    isFinalClarificationStep,
    isGenerating,
    isBackButtonDisabled,
    cycleMessageIndex,
  };
};
