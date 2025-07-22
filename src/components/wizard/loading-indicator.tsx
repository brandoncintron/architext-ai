/**
 * @file Loading indicator component that displays different messages based on selected model and generation state.
 */

import { ClimbingBoxLoader } from "react-spinners";

import { AnimatedText } from "@/components/wizard/animated-text";
import { LoadingIndicatorProps } from "@/components/wizard/types/types";

export const LoadingIndicator = ({
  isGenerating,
  selectedModel,
  cycleMessageIndex,
}: LoadingIndicatorProps) => {
  const isProModel = selectedModel === "gemini-2.5-pro";

  const proModelMainMessage = isGenerating
    ? "Generating your TDD, please wait..."
    : "Analyzing your idea...";

  const proModelSubMessages = [
    isGenerating
      ? "Gemini 2.5 Pro requires additional time to generate a TDD. Please wait." // [0] - for tdd generation
      : "Gemini 2.5 Pro requires additional time to analyze your idea. Please wait.", // [0] - for idea analysis
    "Still generating a response.", // [1]
    "Almost there...", // [2]
    "Just a few more moments...", // [3]
  ];

  // Use progressive index, clamped to available messages
  const currentSubMessageIndex = isProModel
    ? Math.min(cycleMessageIndex, proModelSubMessages.length - 1)
    : 0;

  const proModelMessage = (
    <div className="flex flex-col gap-2">
      <span>{proModelMainMessage}</span>
      <span className="text-xs text-muted-foreground">
      <AnimatedText
        texts={proModelSubMessages}
        currentIndex={currentSubMessageIndex}
      />{" "}
      </span>
    </div>
  );

  const standardMessage = isGenerating
    ? "Generating your TDD, please wait..."
    : "Analyzing your idea...";

  return (
    <div className="flex flex-col items-center text-center">
      <ClimbingBoxLoader size={8} color="" />
      <div className="flex flex-col items-center cursor-default">
        <div>{isProModel ? proModelMessage : standardMessage}</div>
      </div>
    </div>
  );
};
