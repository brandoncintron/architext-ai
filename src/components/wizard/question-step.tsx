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
  type,
  onSelectionChange,
}: QuestionStepProps) => {
  return (
    <>
      <CardHeader>
        <CardTitle className="text-2xl font-bold break-words cursor-default">
          {question}
        </CardTitle>
        <CardDescription className="cursor-default">
          {type === "single-choice" ? (
            <>Select one choice.</>
          ) : (
            <>Select multiple choices.</>
          )} If you don&apos;t see a relevant option here, you can mention it in the last step.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          {options.map((option) => {
            const isSelected = Array.isArray(selection)
              ? selection.includes(option)
              : selection === option;
            return (
              <Button
                key={option}
                variant={isSelected ? "default" : "outline"}
                onClick={() => onSelectionChange(option)}
                className="h-auto w-full sm:w-auto whitespace-normal break-words text-left shrink"
              >
                {option}
              </Button>
            );
          })}
        </div>
      </CardContent>
    </>
  );
};
