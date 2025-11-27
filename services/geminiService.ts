import { GoogleGenAI } from "@google/genai";
import { META_PROMPT_TEMPLATE, DEFAULT_CRITERIA } from "../constants";
import { OptimizationResult } from "../types";

export const optimizePrompt = async (
  prompt: string,
  criteria: string
): Promise<OptimizationResult> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Prepare the content by replacing placeholders in the template
  const effectiveCriteria = criteria.trim() || DEFAULT_CRITERIA;
  
  // We construct the final prompt by injecting user values into the template
  // using split/join as a polyfill for replaceAll to ensure compatibility
  const finalPrompt = META_PROMPT_TEMPLATE
    .split("{$PROMPT}").join(prompt)
    .split("{$EVALUATION_CRITERIA}").join(effectiveCriteria);

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: finalPrompt,
    });

    const text = response.text || "";
    return parseXmlResponse(text);
  } catch (error) {
    console.error("Error optimizing prompt:", error);
    throw error;
  }
};

const extractTagContent = (text: string, tagName: string): string => {
  const regex = new RegExp(`<${tagName}>([\\s\\S]*?)<\\/${tagName}>`, 'i');
  const match = text.match(regex);
  return match ? match[1].trim() : "";
};

const parseXmlResponse = (text: string): OptimizationResult => {
  return {
    scratchpad: extractTagContent(text, "scratchpad"),
    analysis: extractTagContent(text, "analysis"),
    optimizedPrompt: extractTagContent(text, "optimized_prompt"),
    keyImprovements: extractTagContent(text, "key_improvements"),
  };
};