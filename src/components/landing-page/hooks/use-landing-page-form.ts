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

export const useLandingPageForm = ({
  onSubmit,
}: {
  onSubmit: (values: LandingPageFormValues) => void;
}) => {
  const form = useForm<LandingPageFormValues>({
    resolver: zodResolver(landingPageFormSchema),
    defaultValues: {
      idea: "",
    },
    mode: "onChange",
  });

  return { form, onSubmit };
}; 