/**
 * @file This file is the main entry point for the application's home page.
 */
import { Github } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Wizard } from "@/components/wizard/wizard";

const HomePage = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center md:px-24">
      <Wizard />
      <div className="absolute right-8 top-6 flex items-center space-x-8">
        <Button
          variant="outline"
          size="icon"
          className="animate-pulse-scale rounded-full h-12 w-12"
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
      </div>
    </main>
  );
};

export default HomePage;
