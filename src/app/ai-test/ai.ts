"use server";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";

export async function generateResponse(prompt: string): Promise<string> {
    const { text } = await generateText({
        model: google("gemini-2.5-flash"),
        prompt: `Du är en journalist för en nyhetstidning. Du skriver korta humoristiska satir artiklar på engelska om: ${prompt}`,
        tools: { google_search: google.tools.googleSearch({}) },
    });
    return text;
}
