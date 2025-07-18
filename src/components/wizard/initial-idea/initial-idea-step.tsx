/**
 * @file Renders the initial step of the wizard, where the user inputs their project idea.
 */
"use client";

import { Button } from "@/components/ui/button";
import {
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
import { platforms, placeholders } from "@/components/wizard/utils/constants";
import { Loader2 } from "lucide-react";

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
    <>
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
          className="flex flex-col flex-grow justify-center gap-6 md:gap-3"
        >
          <CardContent className="space-y-6">
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
                          className="absolute top-2.5 left-3 text-muted-foreground text-sm pointer-events-none w-[calc(100%-1.5rem)]"
                          aria-hidden="true"
                        >
                          <div className="relative h-10 overflow-hidden">
                            {placeholders.map((text, index) => (
                              <p
                                key={text}
                                className="absolute w-full transition-all duration-500 ease-in-out"
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
          <CardFooter className="flex justify-end">
            <Button type="submit" size="lg" disabled={isSubmitting}>
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Validating...</span>
                </div>
              ) : (
                "Next"
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </>
  );
};
