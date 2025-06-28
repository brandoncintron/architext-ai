/**
 * @file This component manages and renders the multi-step wizard interface.
 */
"use client";

import { useState } from "react";
import { LandingPageForm } from "@/components/landing-page/landing-page-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { QuestionStep } from "./question-step";
import { FinalClarificationStep } from "./final-clarification-step";
import { ResultsStep } from "./results-step";
import { LandingPageFormValues } from "../landing-page/utils/schema";

interface Question {
  question: string;
  options: string[];
}

export const Wizard = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [initialFormValues, setInitialFormValues] = useState<LandingPageFormValues | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [finalClarification, setFinalClarification] = useState("");
  const [generatedTDD, setGeneratedTDD] = useState("");

  const handleInitialSubmit = async (values: LandingPageFormValues) => {
    setIsLoading(true);
    setInitialFormValues(values);
    try {
      const response = await fetch("/api/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Failed to generate questions.");
      }

      const data = await response.json();
      setQuestions(data.questions);
      setAnswers(new Array(data.questions.length).fill(""));
      goToNextStep();
    } catch (error) {
      console.error(error);
      // TODO: Add user-facing error handling
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAnswerSelect = (questionIndex: number, option: string) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = option;
    setAnswers(newAnswers);
  };

  const handleGenerateTDD = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch("/api/generate-tdd", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          initialFormValues,
          questions,
          answers,
          finalClarification,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate TDD.");
      }

      const data = await response.json();
      setGeneratedTDD(data.tdd);
      goToNextStep();
    } catch (error) {
      console.error(error);
      // TODO: Add user-facing error handling
    } finally {
      setIsLoading(false);
    }
  };

  const steps = [
    {
      name: "Initial Idea",
      component: <LandingPageForm onSubmit={handleInitialSubmit} isSubmitting={isLoading} />,
    },
    ...questions.map((q, index) => ({
      name: `Question ${index + 1}`,
      component: (
        <QuestionStep
          question={q.question}
          options={q.options}
          selection={answers[index]}
          onSelectionChange={(option) => handleAnswerSelect(index, option)}
        />
      ),
    })),
    { 
      name: "Final Clarification",
      component: (
        <FinalClarificationStep
          value={finalClarification}
          onChange={setFinalClarification}
        />
      ),
    },
    { 
      name: "Results",
      component: <ResultsStep tdd={generatedTDD} />
    },
  ];

  const goToNextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const goToPreviousStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const CurrentComponent = steps[currentStep].component;
  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;
  const isFinalClarificationStep =
    currentStep === steps.findIndex((s) => s.name === "Final Clarification");
  const isGenerating = isFinalClarificationStep && isLoading;

  return (
    <div className="relative flex w-full flex-col items-center justify-center">
      <div className="absolute inset-x-0 top-0 flex justify-center pt-4">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          {steps.map((step, index) => (
            <div key={step.name} className="flex items-center space-x-2">
              <div
                className={`flex h-6 w-6 items-center justify-center rounded-full ${
                  currentStep === index
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                {index + 1}
              </div>
              <span
                className={currentStep === index ? "font-semibold text-primary" : ""}
              >
                {step.name}
              </span>
              {index < steps.length - 1 && (
                <div className="h-px w-12 bg-muted" />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex w-full min-h-[520px] max-w-4xl items-center justify-center pt-24">
        {isLoading && currentStep === 0 ? (
          <Loader2 className="h-8 w-8 animate-spin" />
        ) : (
          CurrentComponent
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-10 bg-background/80 p-4 backdrop-blur-sm">
        <div className="mx-auto flex w-full max-w-2xl items-center justify-between">
          <Button
            variant="outline"
            onClick={goToPreviousStep}
            disabled={isFirstStep}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          <Button
            variant="default"
            onClick={isFinalClarificationStep ? handleGenerateTDD : goToNextStep}
            disabled={
              isGenerating || isLastStep || (currentStep > 0 && !answers[currentStep - 1] && !isFinalClarificationStep)
            }
          >
            {isGenerating ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            {isFinalClarificationStep ? "Generate TDD" : "Next"}
            {!isGenerating && <ArrowRight className="ml-2 h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
}; 