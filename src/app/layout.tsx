import type { Metadata } from "next";
import { Lexend } from "next/font/google";

import "./globals.css";

import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/ui/theme-provider";

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
  weight: ["200", "300"],
});

export const metadata: Metadata = {
  title: "Architext AI",
  description:
    "Transform your idea into a developer-ready project plan with Architext AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${lexend.className} antialiased bg-background text-foreground`}
      >
        <main className="flex h-screen flex-col overflow-x-hidden dark:bg-gradient-to-br dark:from-gray-900 dark:to-black bg-gradient-to-br from-blue-200 to-background">
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster richColors />
          </ThemeProvider>
        </main>
      </body>
    </html>
  );
}
