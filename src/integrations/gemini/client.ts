import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyDzQ-JQxTmoS7kH1HmoTqlnXeSwCOAvIrg';

// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Get the model
export const geminiProModel = genAI.getGenerativeModel({ model: 'gemini-pro' });
export const geminiProVisionModel = genAI.getGenerativeModel({ model: 'gemini-pro-vision' });

// Simple text generation function
export async function generateText(prompt: string): Promise<string> {
  try {
    const result = await geminiProModel.generateContent(prompt);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating text with Gemini:', error);
    throw error;
  }
}

// Function to analyze text with specific instructions
export async function analyzeText(text: string, instructions: string): Promise<string> {
  try {
    const prompt = `${instructions}\n\nText to analyze: ${text}`;
    const result = await geminiProModel.generateContent(prompt);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error('Error analyzing text with Gemini:', error);
    throw error;
  }
}

// Function to generate suggestions based on input
export async function generateSuggestions(input: string, category: string): Promise<string[]> {
  try {
    const prompt = `Generate 3-5 suggestions for ${category} based on the following input: ${input}. 
    Return only the suggestions as a list with no additional text.`;
    
    const result = await geminiProModel.generateContent(prompt);
    const response = result.response.text();
    
    // Parse the response into an array of suggestions
    return response
      .split('\n')
      .map(line => line.trim())
      .filter(line => line && !line.startsWith('-') && !line.match(/^\d+\./))
      .map(line => line.replace(/^- /, '').replace(/^\d+\. /, ''));
  } catch (error) {
    console.error('Error generating suggestions with Gemini:', error);
    throw error;
  }
}

// Function to process image and extract information
export async function analyzeImage(imageBase64: string, prompt: string): Promise<string> {
  try {
    const imageParts = [
      {
        inlineData: {
          data: imageBase64,
          mimeType: 'image/jpeg'
        }
      }
    ];
    
    const result = await geminiProVisionModel.generateContent([prompt, ...imageParts]);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error('Error analyzing image with Gemini:', error);
    throw error;
  }
} 