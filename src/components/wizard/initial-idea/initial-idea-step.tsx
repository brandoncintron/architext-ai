/**
 * @file Renders the initial step of the wizard, where the user inputs their project idea.
 */
"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useInitialIdeaForm } from "@/components/wizard/initial-idea/hooks/use-initial-idea-form";
import { InitialIdeaStepProps } from "@/components/wizard/types/types";
import { useEffect, useState } from "react";
import { platforms, placeholders } from "@/components/wizard/initial-idea/utils/constants";

export const InitialIdeaStep = ({
  onSubmit,
  isSubmitting,
}: InitialIdeaStepProps) => {
  const { form } = useInitialIdeaForm({ onSubmit });
  const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Card className="w-full max-w-2xl h-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          Welcome to Architext AI
        </CardTitle>
        <CardDescription>
          Input your project idea, and architext will help you build a
          fully-detailed technical design document suited to your needs.
        </CardDescription>
      </CardHeader>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 flex flex-col flex-grow"
        >
          <CardContent className="space-y-6 flex-grow">
            <FormField
              control={form.control}
              name="idea"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>What&apos;s your project idea?</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Textarea placeholder=" " {...field} rows={3} />
                      {!field.value && (
                        <div
                          className="absolute top-2 left-3 text-muted-foreground text-[15px] pointer-events-none w-[calc(100%-1.5rem)] h-5 overflow-hidden"
                          aria-hidden="true"
                        >
                          {placeholders.map((text, index) => (
                            <p
                              key={text}
                              className="absolute truncate w-full transition-all duration-500 ease-in-out"
                              style={{
                                transform: `translateY(${
                                  (index - currentPlaceholderIndex) * 100
                                }%)`,
                                opacity:
                                  index === currentPlaceholderIndex ? 1 : 0,
                              }}
                            >
                              {text}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="platform"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>What would the primary platform be?</FormLabel>
                  <FormControl>
                    <div className="flex gap-2">
                      {platforms.map((p) => (
                        <Button
                          key={p}
                          size={"sm"}
                          variant={field.value === p ? "default" : "outline"}
                          onClick={(e) => {
                            e.preventDefault();
                            field.onChange(p);
                          }}
                          type="button"
                        >
                          {p}
                        </Button>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-end mt-auto">
            <Button type="submit" size="lg" disabled={isSubmitting}>
              {isSubmitting ? "Generating..." : "Start Building"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};
