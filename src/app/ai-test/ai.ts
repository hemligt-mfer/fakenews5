"use server";
import { generateImage, generateText, Output } from "ai";
import { google } from "@ai-sdk/google";
import z from "zod";

const RecipeSchema = z.object({
  recipe: z.object({
    name: z.string().describe("The name of the recipe"),
    description: z.string().describe("Short description of the recipe"),
    ingredients: z.array(
      z.object({
        name: z.string().describe("Name of the ingredient"),
        amount: z.string().describe("Amount of ingredient"),
        unit: z.string().describe("Name of the measurement unit, g, dc, KG.."),
      }),
    ),
    steps: z.array(z.string()),
  }),
});

export type Recipe = z.infer<typeof RecipeSchema>;
export type RecipeWithImage = Recipe & {
  image?: string;
};

export async function generateResponse(
  prompt: string,
): Promise<RecipeWithImage> {
  const { output } = await generateText({
    model: google("gemini-2.5-flash"),
    output: Output.object({ schema: RecipeSchema }),
    prompt,
    // tools: { google_search: google.tools.googleSearch({}) },
  });
  const image = await generateRecipeImage(output.recipe.name);
  const recipeWithImage: RecipeWithImage = {
    recipe: output.recipe,
    image,
  };
  return recipeWithImage;
}

export async function generateRecipeImage(prompt: string): Promise<string> {
  const { image } = await generateImage({
    model: google.image("gemini-2.5-flash-image"),
    prompt: `Generate an image of this dish ${prompt}`,
  });
  //upload to s3
  return image.base64;
}
