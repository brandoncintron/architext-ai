/**
 * @file This component renders the final results step, displaying the generated TDD.
 */
"use client";

import React, { useState } from "react";

import { EditorView } from "@codemirror/view";
import { Check, Clipboard, Eye, Pencil, RotateCcw } from "lucide-react";
import dynamic from "next/dynamic";

import { Button } from "@/components/ui/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useCopyToClipboard } from "@/components/wizard/results/hooks/use-copyto-clipboard";
import { ResultsStepProps } from "@/components/wizard/types/types";
import { useIsMobile } from "@/hooks/use-mobile";

const MarkdownEditor = dynamic(() => import("@uiw/react-markdown-editor"), {
  ssr: false,
  loading: () => <p>Loading editor...</p>,
});

const MarkdownPreview = dynamic(
  () =>
    import("@uiw/react-markdown-editor").then((mod) => {
      return mod.default.Markdown;
    }),
  { ssr: false, loading: () => <p>Loading preview...</p> },
);

const largeTextTheme = EditorView.theme({
  "&": {
    fontSize: "1rem",
  },
});

export const ResultsStep = ({ tdd, onStartOver }: ResultsStepProps) => {
  const [markdown, setMarkdown] = useState(tdd);
  const [showPreview, setShowPreview] = useState(true);
  const { hasCopied, copyToClipboard } = useCopyToClipboard();
  const isMobile = useIsMobile();

  const mobileView = (
    <div className="flex-1 rounded-lg border">
      {showPreview ? (
        <MarkdownPreview
          source={markdown}
          className="h-full overflow-y-auto p-8"
        />
      ) : (
        <MarkdownEditor
          value={markdown}
          onChange={(value) => setMarkdown(value)}
          height="100%"
          className="h-full"
          extensions={[EditorView.lineWrapping, largeTextTheme]}
        />
      )}
    </div>
  );

  const desktopView = (
    <ResizablePanelGroup
      direction="horizontal"
      className="flex-1 rounded-lg border"
    >
      <ResizablePanel defaultSize={50}>
        <MarkdownEditor
          value={markdown}
          onChange={(value) => setMarkdown(value)}
          height="100%"
          className="h-full"
          extensions={[EditorView.lineWrapping, largeTextTheme]}
        />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={50}>
        <MarkdownPreview
          source={markdown}
          className="h-full overflow-y-auto p-8"
        />
      </ResizablePanel>
    </ResizablePanelGroup>
  );

  return (
    <>
      <div className="flex flex-col h-screen w-screen p-4 md:px-12 md:py-6">
        <div className="mb-4 flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
          <div className="md:pr-4">
            <h1 className="text-lg font-semibold">
              Technical Design Document Editor
            </h1>
            <p className="text-sm text-muted-foreground">
              Review and edit the generated document. When you&apos;re ready,
              copy it to your clipboard.
            </p>
          </div>
          <div className="flex w-full flex-wrap items-center justify-center gap-2 space-x-2 md:w-auto md:flex-shrink-0 md:justify-start">
            <Button onClick={onStartOver}>
            <RotateCcw className="mr-2 h-4 w-4" />
              Start Over
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => copyToClipboard(markdown)}
            >
              {hasCopied ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Clipboard className="mr-2 h-4 w-4" />
                  Copy to Clipboard
                </>
              )}
            </Button>
          </div>
        </div>
        {isMobile ? mobileView : desktopView}
      </div>
      {isMobile && (
        <Button
          variant="default"
          className="fixed top-4 left-6 flex h-14 items-center rounded-full px-6 text-lg font-medium shadow-2xl opacity-85"
          onClick={() => setShowPreview(!showPreview)}
          aria-label={showPreview ? "Back to Editor" : "Show Preview"}
        >
          {showPreview ? (
            <>
              <Pencil className="mr-2 h-6 w-6" />
              Editor
            </>
          ) : (
            <>
              <Eye className="mr-2 h-6 w-6" />
              Preview
            </>
          )}
        </Button>
      )}
    </>
  );
};
