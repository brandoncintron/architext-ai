"use server";

import { InitialIdeaFormValues } from "@/components/wizard/initial-idea/utils/schema";
import { Question } from "@/components/wizard/types/types";

/**
 * @file This file contains server-side actions for the wizard.
 */

type GenerateTddPayload = {
  initialFormValues: InitialIdeaFormValues | null;
  questions: Question[];
  answers: (string | string[] | null)[];
  finalClarification: string;
};

export async function generatePlan(payload: InitialIdeaFormValues) {
  try {
    const response = await fetch(
      `${process.env.API_URL}/api/generate_plan`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Failed to generate questions.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error in generatePlan server action:", error);
    if (error instanceof Error) {
      // Re-throw the error to be caught by the client
      throw new Error(error.message);
    }
    throw new Error("An unknown error occurred while generating the plan.");
  }
}

export async function generateTdd(payload: GenerateTddPayload) {
  try {
    const response = await fetch(`${process.env.API_URL}/api/generate_tdd`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Failed to generate TDD.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error in generateTdd server action:", error);
    // Re-throw the error to be caught by the client
    throw new Error(
      "An error occurred while generating the TDD. Please try again.",
    );
  }
} 