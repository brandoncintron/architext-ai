/**
 * @file Defines the types and validation schema for the landing page form.
 */
import * as z from "zod";

export const landingPageFormSchema = z.object({
  idea: z.string().min(10, {
    message: "Your idea must be at least 10 characters long.",
  }),
  platform: z.enum(["Web App", "Mobile App", "Desktop App"], {
    errorMap: () => ({ message: "Please select a platform." }),
  }),
});

export type LandingPageFormValues = z.infer<typeof landingPageFormSchema>; 