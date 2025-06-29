/**
 * @file This component displays the "Powered by Google Gemini" logo and text.
 */
import { GeminiIcon } from "./gemini-icon";

export const GoogleGeminiLogo = () => {
  return (
    <div className="flex items-center justify-center space-x-2">
      <p className="text-sm font-medium text-muted-foreground">Powered by</p>
      <div className="flex items-center justify-center space-x-1">
        <GeminiIcon className="h-4 w-4" />
        <span className="text-sm font-semibold">Google Gemini</span>
      </div>
    </div>
  );
}; 