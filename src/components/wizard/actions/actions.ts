"use server";

import { InitialIdeaFormValues } from "@/components/wizard/steps/initial-idea/utils/schema";
import { GenerateTddPayload, Model } from "@/components/wizard/types/types";

/**
 * @file This file contains server-side actions for the wizard.
 */

export async function validateIdea(payload: InitialIdeaFormValues) {
  try {
    const response = await fetch(`${process.env.API_URL}/api/validate_idea`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Failed to validate idea.");
    }

    return { success: true };
  } catch (error) {
    console.error("Error in validateIdea server action:", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An unknown error occurred during validation.");
  }
}

export async function generateQuestions(
  payload: InitialIdeaFormValues & { model: Model },
) {
  try {
    const response = await fetch(
      `${process.env.API_URL}/api/generate_questions`,
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
    console.error("Error in generateQuestions server action:", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error(
      "An unknown error occurred while generating the questions.",
    );
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

    throw new Error(
      "An error occurred while generating the TDD. Please try again.",
    );
  }
}
