/**
 * @file This component renders the final clarification step in the wizard.
 */
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface FinalClarificationStepProps {
  value: string;
  onChange: (value: string) => void;
}

export const FinalClarificationStep = ({ value, onChange }: FinalClarificationStepProps) => {
  return (
    <>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          Final Clarifications
        </CardTitle>
        <CardDescription>
          Is there anything else you&apos;d like to add? Provide any final constraints,
          preferences, or context for the AI.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col">
        <div className="grid w-full gap-1.5 flex-grow">
          <Label htmlFor="clarifications">
            Your final thoughts:
          </Label>
          <Textarea
            placeholder="e.g., Please prioritize open-source technologies and ensure the database is GDPR compliant."
            id="clarifications"
            rows={5}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="flex-grow"
          />
        </div>
      </CardContent>
    </>
  );
}; 