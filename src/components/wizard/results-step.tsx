/**
 * @file This component renders the final results step, displaying the generated TDD.
 */
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Clipboard, RotateCcw } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useState } from "react";
import { toast } from "sonner";

interface ResultsStepProps {
  tdd: string;
  onStartOver: () => void;
}

export const ResultsStep = ({ tdd, onStartOver }: ResultsStepProps) => {
  const [hasCopied, setHasCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(tdd);
    setHasCopied(true);
    toast.success("TDD copied to clipboard!");
    setTimeout(() => {
      setHasCopied(false);
    }, 2000);
  };

  return (
    <Card className="w-full max-w-4xl my-6">
      <CardHeader>
        <div className="flex items-start md:items-center justify-between">
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
      <CardContent className="prose prose-sm dark:prose-invert max-w-none overflow-y-auto flex-grow">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{tdd}</ReactMarkdown>
      </CardContent>
      <CardFooter className="flex justify-center mt-auto">
        <Button variant="default" onClick={onStartOver}>
          <RotateCcw className="mr-2 h-4 w-4" />
          Start Over
        </Button>
      </CardFooter>
    </Card>
  );
};
