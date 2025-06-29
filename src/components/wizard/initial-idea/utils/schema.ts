/**
 * @file Defines the types and validation schema for the initial idea form.
 */
import * as z from "zod";

export const initialIdeaFormSchema = z.object({
  idea: z.string().min(10, {
    message: "Your idea must be at least 10 characters long.",
  }),
  platform: z.enum(["Web App", "Mobile App", "Desktop App"], {
    errorMap: () => ({ message: "Please select a platform." }),
  }),
});

export type InitialIdeaFormValues = z.infer<typeof initialIdeaFormSchema>; 