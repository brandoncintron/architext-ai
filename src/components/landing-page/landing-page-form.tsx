/**
 * @file Renders the main content for the landing page, including the project idea form.
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
import { useLandingPageForm } from "./hooks/use-landing-page-form";

const platforms = ["Web App", "Mobile App", "Desktop App"] as const;

export const LandingPageForm = () => {
  const { form, onSubmit } = useLandingPageForm();

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          Welcome to Architext AI
        </CardTitle>
        <CardDescription>
          Input your project idea, and architext will help you build a plan
          suited to your needs.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="idea"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>What's your project idea?</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., I want to build a resume-review app for students"
                      {...field}
                      rows={3}
                    />
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
                    <div className="flex flex-wrap gap-2">
                      {platforms.map((p) => (
                        <Button
                          key={p}
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
            <Button type="submit" size="lg">
              Start Building
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};
