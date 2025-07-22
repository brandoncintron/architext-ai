import { useEffect, useState } from "react";

import { Model } from "@/components/wizard/types/types";
import { models } from "@/components/wizard/utils/constants";

export const useCyclingIndex = ({
  isLoading,
  selectedModel,
}: {
  isLoading: boolean;
  selectedModel: Model;
}) => {
  const [cycleMessageIndex, setCycleMessageIndex] = useState(0);

  useEffect(() => {
    if (isLoading && selectedModel === "gemini-2.5-pro") {
      const intervals = [20000, 40000, 60000];
      const timers = intervals.map((delay, index) =>
        setTimeout(() => setCycleMessageIndex(index + 1), delay),
      );
      return () => timers.forEach((timer) => clearTimeout(timer));
    } else {
      setCycleMessageIndex(0);
    }
  }, [isLoading, selectedModel]);

  return {
    cycleMessageIndex,
  };
};
