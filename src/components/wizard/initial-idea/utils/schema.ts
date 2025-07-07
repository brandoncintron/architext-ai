/**
 * @file Defines the types and validation schema for the initial idea form.
 */
import * as z from "zod";
import { platforms } from "@/components/wizard/initial-idea/utils/constants";

export const initialIdeaFormSchema = z.object({
  idea: z.string().min(10, {
    message: "Your idea must be at least 10 characters long.",
  }),
  platform: z.enum(platforms, {
    errorMap: () => ({ message: "Please select a platform." }),
  }),
});

export type InitialIdeaFormValues = z.infer<typeof initialIdeaFormSchema>;
