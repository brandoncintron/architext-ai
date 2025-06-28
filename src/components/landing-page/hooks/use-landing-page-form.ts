/**
 * @file This hook provides the form logic for the landing page.
 */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  landingPageFormSchema,
  LandingPageFormValues,
} from "@/components/landing-page/utils/schema";

export const useLandingPageForm = () => {
  const form = useForm<LandingPageFormValues>({
    resolver: zodResolver(landingPageFormSchema),
    defaultValues: {
      idea: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (values: LandingPageFormValues) => {
    try {
      const response = await fetch("/api/generate-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Failed to generate plan");
      }

      const result = await response.json();
      console.log("API Response:", result);
    } catch (error) {
      console.error("There was an error submitting the form:", error);
    }
  };

  return { form, onSubmit };
}; 