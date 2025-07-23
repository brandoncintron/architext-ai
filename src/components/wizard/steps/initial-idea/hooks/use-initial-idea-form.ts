/**
 * @file This hook provides the form logic for the initial idea step.
 */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  initialIdeaFormSchema,
  InitialIdeaFormValues,
} from "@/components/wizard/steps/initial-idea/utils/schema";

export const useInitialIdeaForm = ({
  onSubmit,
}: {
  onSubmit: (values: InitialIdeaFormValues) => void;
}) => {
  const form = useForm<InitialIdeaFormValues>({
    resolver: zodResolver(initialIdeaFormSchema),
    defaultValues: {
      idea: "",
      platform: undefined,
    },
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  return { form, onSubmit };
};
