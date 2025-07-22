/**
 * @file This component renders the model selection step in the wizard.
 */
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ModelSelectionStepProps } from "@/components/wizard/types/types";
import { models } from "@/components/wizard/utils/constants";

export const ModelSelectionStep = ({
  onSelectModel,
  selectedModel,
}: ModelSelectionStepProps) => {
  return (
    <>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Select a Model</CardTitle>
        <CardDescription>
          Select the model that best fits your project&apos;s complexity and
          desired output.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 md:mt-4">
        {models.map((model) => (
          <Card
            key={model.name}
            className={`cursor-pointer p-4 flex flex-col justify-center text-center gap-2 transition-all duration-200 h-32 ${
              selectedModel === model.name
                ? "bg-accent"
                : "border-border hover:bg-accent"
            }`}
            onClick={() => onSelectModel(model.name)}
          >
            <h3 className="text-lg font-semibold flex items-center justify-center gap-2">
              {model.icon}
              {model.title}
            </h3>
            <p className="text-sm text-muted-foreground mx-4">
              {model.description}
            </p>
          </Card>
        ))}
      </CardContent>
    </>
  );
};
