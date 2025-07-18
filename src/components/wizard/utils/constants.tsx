import { GeminiIcon } from "@/components/ui/gemini-icon";
import { ZapIcon } from "@/components/ui/zap-icon";

/**
 * @file This file contains constants used throughout the wizard.
 */

export const platforms = ["Web App", "Mobile App", "Desktop App"] as const;

export const models = [
  { // Update in types too
    name: "gemini-2.0-flash",
    title: "Gemini 2.0 Flash",
    description:
      "A fast and efficient model, excels at generating simpler project plans quickly.",
    icon: <ZapIcon className="h-5 w-5" />,
  },
  {
    name: "gemini-2.5-pro",
    title: "Gemini 2.5 Pro",
    description:
      "Google's most powerful and capable model, perfect for generating plans for complex projects.",
    icon: <GeminiIcon className="h-5 w-5" />,
  },
] as const;

export const placeholders = [
  "e.g., A resume-generator app for students",
  "e.g., A platform for local artists to sell their work",
  "e.g., A mobile app for tracking personal fitness goals",
  "e.g., A tool to help manage and automate social media posts",
]; 