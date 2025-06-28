/**
 * @file This component renders the final results step, displaying the generated TDD.
 */
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Clipboard } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useState } from "react";

interface ResultsStepProps {
  tdd: string;
}

export const ResultsStep = ({ tdd }: ResultsStepProps) => {
  const [hasCopied, setHasCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(tdd);
    setHasCopied(true);
    setTimeout(() => {
      setHasCopied(false);
    }, 2000);
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">
              Your Technical Design Document is Ready
            </CardTitle>
            <CardDescription>
              Review the generated TDD below. You can copy it to your clipboard.
            </CardDescription>
          </div>
          <Button variant="outline" size="icon" onClick={copyToClipboard}>
            {hasCopied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Clipboard className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="prose prose-sm dark:prose-invert max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{tdd}</ReactMarkdown>
      </CardContent>
    </Card>
  );
}; 