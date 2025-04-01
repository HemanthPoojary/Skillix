import OpenAI from 'openai';

// Initialize the OpenAI client - Note that we don't actually use this client directly
// as we're using the API routes instead. Fixed for better client-side error handling.
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || '',
  dangerouslyAllowBrowser: true // Note: In production, use server-side API calls instead
});

// Client-side helper functions for OpenAI content generation

// Function to generate text content
export async function generateTextContent(prompt: string): Promise<string> {
  if (!prompt) {
    console.error("No prompt provided for text generation");
    return "Please provide a topic to generate content.";
  }

  try {
    const response = await fetch('/api/openai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'text',
        prompt: prompt,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Failed to generate content: ${response.status}`);
    }

    const data = await response.json().catch(() => ({ result: null }));
    return data.result || "Sorry, I couldn't generate content for that prompt.";
  } catch (error) {
    console.error("Error generating text content:", error);
    // Return a fallback instead of throwing to prevent client-side crash
    return "Content generation failed. Please try again later.";
  }
}

// Function to generate quiz questions
export async function generateQuizQuestions(
  topic: string, 
  difficulty: string = "medium", 
  numberOfQuestions: number = 5
): Promise<any> {
  if (!topic) {
    console.error("No topic provided for quiz generation");
    return {
      questions: [
        { 
          questionText: "Sample Question", 
          options: ["Option 1", "Option 2", "Option 3", "Option 4"], 
          correctAnswerIndex: 0 
        }
      ]
    };
  }

  try {
    const response = await fetch('/api/openai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'quiz',
        prompt: topic,
        options: {
          difficulty,
          numberOfQuestions
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Failed to generate quiz questions: ${response.status}`);
    }

    const data = await response.json().catch(() => ({ result: null }));
    if (!data.result) {
      throw new Error("No quiz data returned from API");
    }
    return data.result;
  } catch (error) {
    console.error("Error generating quiz questions:", error);
    // Return a fallback quiz structure instead of throwing
    return {
      questions: [
        { 
          questionText: `Sample question about ${topic}`, 
          options: ["Option 1", "Option 2", "Option 3", "Option 4"], 
          correctAnswerIndex: 0 
        }
      ]
    };
  }
}

// Function to generate image prompts for DALL-E
export async function generateImagePrompt(description: string): Promise<string> {
  if (!description) {
    console.error("No description provided for image prompt");
    return "An educational illustration with colorful elements";
  }

  try {
    const response = await fetch('/api/openai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'imagePrompt',
        prompt: description,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Failed to generate image prompt: ${response.status}`);
    }

    const data = await response.json().catch(() => ({ result: null }));
    return data.result || "An educational illustration related to the topic";
  } catch (error) {
    console.error("Error generating image prompt:", error);
    // Return a fallback prompt instead of throwing
    return "An educational illustration with vibrant colors and engaging design";
  }
}

// Function to generate an actual image using DALL-E
export async function generateImage(prompt: string): Promise<string> {
  if (!prompt) {
    console.error("No prompt provided for image generation");
    return ""; // Return empty string to indicate failure
  }

  try {
    const response = await fetch('/api/openai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'image',
        prompt: prompt,
      }),
      // Add a reasonable timeout for image generation
      signal: AbortSignal.timeout(30000), // 30 seconds timeout
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Failed to generate image: ${response.status}`);
    }

    const data = await response.json().catch(() => ({ result: null }));
    return data.result || "";
  } catch (error) {
    console.error("Error generating image:", error);
    // Return empty string to indicate failure
    return "";
  }
}

// Function to generate video script
export async function generateVideoScript(
  topic: string, 
  duration: string = "5 minutes", 
  audience: string = "students"
): Promise<string> {
  if (!topic) {
    console.error("No topic provided for video script");
    return "Please provide a topic to generate a video script.";
  }

  try {
    const response = await fetch('/api/openai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'video',
        prompt: topic,
        options: {
          duration,
          audience
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Failed to generate video script: ${response.status}`);
    }

    const data = await response.json().catch(() => ({ result: null }));
    return data.result || "Could not generate a video script. Please try again with a different topic.";
  } catch (error) {
    console.error("Error generating video script:", error);
    // Return a fallback message instead of throwing
    return "Video script generation failed. Please try again later.";
  }
} 