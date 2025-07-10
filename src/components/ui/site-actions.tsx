/**
 * @file This component renders the site-wide action buttons, such as the theme toggle and GitHub link.
 */
import { Github } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";

export const SiteActions = () => {
  return (
    <>
      <Button
          variant="outline"
          size="icon"
          className="animate-pulse-scale rounded-full h-12 w-12 mr-5"
          asChild
        >
        <a
          href="https://github.com/brandoncintron/architext-ai"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Github className="h-5 w-5" />
          <span className="sr-only">GitHub</span>
        </a>
      </Button>
      <ModeToggle />
    </>
  );
}; 