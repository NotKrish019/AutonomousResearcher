import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { ChatOpenAI } from '@langchain/openai';

export const getLLM = (temperature = 0.2) => {
  const geminiKey = process.env.GEMINI_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  if (geminiKey && geminiKey !== 'your_gemini_api_key_here') {
    return new ChatGoogleGenerativeAI({
      apiKey: geminiKey,
      modelName: process.env.GEMINI_MODEL || 'gemini-pro',
      temperature,
    });
  }

  if (openaiKey && openaiKey !== 'your_openai_api_key_here') {
    return new ChatOpenAI({
      apiKey: openaiKey,
      modelName: 'gpt-4o-mini',
      temperature,
    });
  }

  // Gracefully return null for mock fallback mode
  return null;
};

export const parseJSON = (text) => {
  try {
    // Clean markdown code fence blocks if present
    const cleaned = text
      .replace(/```json/gi, '')
      .replace(/```/g, '')
      .trim();
    return JSON.parse(cleaned);
  } catch (error) {
    console.error('[JSON Parse Error] Could not parse LLM output:', text);
    throw error;
  }
};
