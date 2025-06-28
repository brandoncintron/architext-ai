/**
 * @file This component displays the final generated TDD.
 */
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const ResultsStep = () => {
  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          Your Technical Design Document
        </CardTitle>
        <CardDescription>
          Here is the generated plan for your project. You can copy it to your
          clipboard.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="prose prose-sm max-w-none rounded-lg border p-4">
          <p>Generating your document...</p>
        </div>
      </CardContent>
    </Card>
  );
}; 