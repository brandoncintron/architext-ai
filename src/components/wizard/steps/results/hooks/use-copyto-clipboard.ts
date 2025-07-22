/**
 * @file This hook provides clipboard functionality with state management for copy success.
 */
"use client";

import { useState } from "react";

import { toast } from "sonner";

export const useCopyToClipboard = () => {
  const [hasCopied, setHasCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setHasCopied(true);
    toast.success("TDD copied to clipboard!");
    setTimeout(() => {
      setHasCopied(false);
    }, 2000);
  };

  return { hasCopied, copyToClipboard };
};
