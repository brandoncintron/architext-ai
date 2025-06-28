/**
 * @file This component renders a single question step in the wizard.
 */
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface QuestionStepProps {
  question: string;
  description: string;
  options: string[];
}

export const QuestionStep = ({
  question,
  description,
  options,
}: QuestionStepProps) => {
  const [selection, setSelection] = useState<string | null>(null);

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">{question}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {options.map((option) => (
            <Button
              key={option}
              variant={selection === option ? "default" : "outline"}
              onClick={() => setSelection(option)}
            >
              {option}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}; 