/**
 * @file This component renders a single question step in the wizard.
 */
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface QuestionStepProps {
  question: string;
  options: string[];
  selection: string | null;
  onSelectionChange: (option: string) => void;
}

export const QuestionStep = ({
  question,
  options,
  selection,
  onSelectionChange,
}: QuestionStepProps) => {
  return (
    <>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">{question}</CardTitle>
        <CardDescription>
          Your choice will help tailor the final architectural plan.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {options.map((option) => (
            <Button
              key={option}
              variant={selection === option ? "default" : "outline"}
              onClick={() => onSelectionChange(option)}
            >
              {option}
            </Button>
          ))}
        </div>
      </CardContent>
    </>
  );
}; 