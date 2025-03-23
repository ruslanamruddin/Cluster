import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyDzQ-JQxTmoS7kH1HmoTqlnXeSwCOAvIrg';

// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Get the model - Gemini 2.0 Flash supports multimodal capabilities
export const geminiModel = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

// Simple text generation function
export async function generateText(prompt: string, options: { forceValidJson?: boolean } = {}): Promise<string> {
  try {
    // Build the full prompt with appropriate instructions
    let fullPrompt = prompt;
    
    if (options.forceValidJson) {
      // Add special instructions for guaranteed valid JSON responses
      fullPrompt = `${prompt}
      
      CRITICAL INSTRUCTIONS:
      1. Your response must be VALID JSON only.
      2. DO NOT include any markdown formatting like \`\`\`json or \`\`\`.
      3. DO NOT include any explanations before or after the JSON.
      4. DO NOT include any line numbers or comments in the JSON.
      5. Always use double quotes for keys and string values.
      6. The response should start with '[' or '{' and end with ']' or '}'.
      
      Example of valid response format:
      [{"name": "JavaScript", "level": "expert"}, {"name": "React", "level": "intermediate"}]
      `;
    } else {
      // Default instruction to avoid markdown when returning JSON
      fullPrompt = `${prompt}\n\nIMPORTANT: If responding with JSON, return the raw JSON without any markdown formatting, code blocks, or additional explanation.`;
    }
    
    console.log('=== GEMINI API - REQUEST ===');
    console.log('Model: gemini-2.0-flash');
    console.log('Force valid JSON:', options.forceValidJson ? 'Yes' : 'No');
    console.log('Prompt length:', fullPrompt.length);
    
    const result = await geminiModel.generateContent(fullPrompt);
    const response = result.response;
    const responseText = response.text();
    
    // Post-process response if forcing valid JSON
    let processedResponse = responseText;
    if (options.forceValidJson) {
      // Strip any accidental markdown or explanatory text
      if (processedResponse.includes('```json')) {
        processedResponse = processedResponse.replace(/```json\s*|\s*```/g, '');
      } else if (processedResponse.includes('```')) {
        processedResponse = processedResponse.replace(/```\s*|\s*```/g, '');
      }
      
      // Ensure the response starts with a JSON character
      processedResponse = processedResponse.trim();
      if (!processedResponse.startsWith('[') && !processedResponse.startsWith('{')) {
        const jsonStart = processedResponse.indexOf('[');
        if (jsonStart >= 0) {
          processedResponse = processedResponse.substring(jsonStart);
        }
      }
      
      // Ensure the response ends with a JSON character
      if (!processedResponse.endsWith(']') && !processedResponse.endsWith('}')) {
        const jsonEnd = Math.max(processedResponse.lastIndexOf(']'), processedResponse.lastIndexOf('}'));
        if (jsonEnd >= 0) {
          processedResponse = processedResponse.substring(0, jsonEnd + 1);
        }
      }
    }
    
    console.log('=== GEMINI API - RESPONSE ===');
    console.log('Response length:', processedResponse.length);
    console.log('Response preview:', processedResponse.substring(0, 200) + (processedResponse.length > 200 ? '...' : ''));
    console.log('==========================');
    
    return processedResponse;
  } catch (error) {
    console.error('Error generating text with Gemini:', error);
    throw error;
  }
}

// Function to analyze text with specific instructions
export async function analyzeText(text: string, instructions: string): Promise<string> {
  try {
    const prompt = `${instructions}\n\nText to analyze: ${text}`;
    const result = await geminiModel.generateContent(prompt);
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
    
    const result = await geminiModel.generateContent(prompt);
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
    
    const result = await geminiModel.generateContent([prompt, ...imageParts]);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error('Error analyzing image with Gemini:', error);
    throw error;
  }
} 