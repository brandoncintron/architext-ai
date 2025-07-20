/**
 * @file This component renders the final results step, displaying the generated TDD.
 */
"use client";

import React, {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { EditorView } from "@codemirror/view";
import type { Element } from "hast";
import {
  Check,
  Clipboard,
  Eye,
  Pencil,
  RotateCcw,
  Terminal,
} from "lucide-react";
import mermaid from "mermaid";
import dynamic from "next/dynamic";
import { getCodeString } from "rehype-rewrite";
import rehypeSanitize from "rehype-sanitize";

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

const rehypePlugins = [rehypeSanitize];

const largeTextTheme = EditorView.theme({
  "&": {
    fontSize: "1rem",
  },
});

const randomid = () => parseInt(String(Math.random() * 1e15), 10).toString(36);

const Code = ({
  children = [],
  className,
  ...props
}: {
  children?: React.ReactNode;
  className?: string;
  node?: Element;
}) => {
  const demoid = useRef(`dome${randomid()}`);
  const [container, setContainer] = useState<HTMLElement | null>(null);
  const isMermaid =
    className && /^language-mermaid/.test(className.toLocaleLowerCase());
  const code =
    props.node && props.node.children
      ? getCodeString(props.node.children)
      : React.Children.toArray(children)[0] || "";

  const reRender = useCallback(async () => {
    if (container && isMermaid) {
      try {
        const { svg } = await mermaid.render(demoid.current, code as string);
        container.innerHTML = svg;
      } catch (error: unknown) {
        container.innerHTML = String(error);
      }
    }
  }, [container, isMermaid, code, demoid]);

  useEffect(() => {
    reRender();
  }, [reRender]);

  const refElement = useCallback((node: HTMLElement | null) => {
    if (node !== null) {
      setContainer(node);
    }
  }, []);

  if (isMermaid) {
    return (
      <Fragment>
        <code id={demoid.current} style={{ display: "none" }} />
        <code ref={refElement} data-name="mermaid" />
      </Fragment>
    );
  }
  return <code>{children}</code>;
};

export const ResultsStep = ({
  tdd,
  onStartOver,
  selectedModel,
  models,
}: ResultsStepProps) => {
  const [markdown, setMarkdown] = useState(tdd);
  const [showPreview, setShowPreview] = useState(true);
  const { hasCopied, copyToClipboard } = useCopyToClipboard();
  const isMobile = useIsMobile();
  const selectedModelTitle =
    models.find((m) => m.name === selectedModel)?.title || "";

  const mobileView = (
    <div className="flex-1 rounded-lg border">
      {showPreview ? (
        <MarkdownPreview
          source={markdown}
          className="h-full overflow-y-auto p-8"
          components={{ code: Code }}
          rehypePlugins={rehypePlugins}
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
          components={{ code: Code }}
          rehypePlugins={rehypePlugins}
        />
      </ResizablePanel>
    </ResizablePanelGroup>
  );

  return (
    <>
      <div className="flex flex-col h-screen w-screen p-4 md:px-12 md:py-6">
        <div className="mb-4 flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
          <div className="md:pr-4">
            <h1 className="text-lg font-semibold">Architext Markdown Editor</h1>
            <p className="text-sm text-muted-foreground">
              Review and edit the generated document. When you&apos;re ready,
              copy it to your clipboard.
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
              <Terminal className="h-4 w-4" />
              <span>
                <strong>Generated by: {selectedModelTitle}</strong> —
                AI-generated content may be inaccurate. Please review and verify
                the results.
              </span>
            </div>
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
