/**
 * @file This component manages and renders the multi-step wizard interface.
 */
"use client";

import { useState } from "react";
import { LandingPageForm } from "@/components/landing-page/landing-page-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { QuestionStep } from "./question-step";
import { FinalClarificationStep } from "./final-clarification-step";
import { ResultsStep } from "./results-step";

const WIZARD_STEPS = [
  { component: <LandingPageForm />, name: "Initial Idea" },
  {
    component: (
      <QuestionStep
        question="What is the most critical priority for the architecture?"
        description="This helps in making trade-off decisions later on."
        options={[
          "Speed / Low Latency",
          "Scalability",
          "High Availability",
          "Security",
          "Cost-Effectiveness",
        ]}
      />
    ),
    name: "Question 1",
  },
  {
    component: (
      <QuestionStep
        question="What is the expected user load for the first six months?"
        description="This will influence database and infrastructure choices."
        options={["< 1,000 Users", "1k - 10k Users", "10k - 100k Users", "100k+ Users"]}
      />
    ),
    name: "Question 2",
  },
  {
    component: (
      <QuestionStep
        question="How will user authentication be handled?"
        description="Select the primary method for identifying users."
        options={[
          "Email & Password",
          "Social Logins (Google, GitHub)",
          "Magic Links",
          "Not Required",
        ]}
      />
    ),
    name: "Question 3",
  },
  { component: <FinalClarificationStep />, name: "Final Clarification" },
  { component: <ResultsStep />, name: "Results" },
];

export const Wizard = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const goToNextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, WIZARD_STEPS.length - 1));
  };

  const goToPreviousStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const CurrentComponent = WIZARD_STEPS[currentStep].component;

  return (
    <div className="relative flex w-full flex-col items-center justify-center">
      <div className="absolute inset-x-0 top-0 flex justify-center pt-4">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          {WIZARD_STEPS.map((step, index) => (
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
              {index < WIZARD_STEPS.length - 1 && (
                <div className="h-px w-12 bg-muted" />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex w-full min-h-[520px] max-w-2xl items-center justify-center pt-24">
        {CurrentComponent}
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-10 bg-background/80 p-4 backdrop-blur-sm">
        <div className="mx-auto flex w-full max-w-2xl items-center justify-between">
          <Button
            variant="outline"
            onClick={goToPreviousStep}
            disabled={currentStep === 0}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          <Button
            variant="default"
            onClick={goToNextStep}
            disabled={currentStep === WIZARD_STEPS.length - 1}
          >
            Next
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}; 