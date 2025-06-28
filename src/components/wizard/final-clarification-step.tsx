/**
 * @file This component renders the final clarification step in the wizard.
 */
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export const FinalClarificationStep = () => {
  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          Final Clarifications
        </CardTitle>
        <CardDescription>
          Is there anything else you&apos;d like to add? Provide any final constraints,
          preferences, or context for the AI.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid w-full gap-1.5">
          <Label htmlFor="clarifications">
            Your final thoughts:
          </Label>
          <Textarea
            placeholder="e.g., Please prioritize open-source technologies and ensure the database is GDPR compliant."
            id="clarifications"
            rows={5}
          />
        </div>
      </CardContent>
    </Card>
  );
}; 