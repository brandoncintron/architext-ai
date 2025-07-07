/**
 * @file This component renders a single question step in the wizard.
 */
"use client";

import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { QuestionStepProps } from "@/components/wizard/types/types";

export const QuestionStep = ({
  question,
  options,
  selection,
  onSelectionChange,
}: QuestionStepProps) => {
  return (
    <>
      <CardHeader>
        <CardTitle className="text-2xl font-bold break-words">
          {question}
        </CardTitle>
        <CardDescription>
          Your choice will help tailor the final architectural plan.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          {options.map((option) => (
            <Button
              key={option}
              variant={selection === option ? "default" : "outline"}
              onClick={() => onSelectionChange(option)}
              className="h-auto whitespace-normal sm:h-10 sm:whitespace-nowrap"
            >
              {option}
            </Button>
          ))}
        </div>
      </CardContent>
    </>
  );
};
