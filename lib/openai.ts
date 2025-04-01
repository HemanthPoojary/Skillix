import OpenAI from 'openai';

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Note: In production, use server-side API calls instead
});

// Client-side helper functions for OpenAI content generation

// Function to generate text content
export async function generateTextContent(prompt: string): Promise<string> {
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
      const error = await response.json();
      throw new Error(error.error || 'Failed to generate content');
    }

    const data = await response.json();
    return data.result || "Sorry, I couldn't generate content for that prompt.";
  } catch (error) {
    console.error("Error generating text content:", error);
    throw new Error("Failed to generate content. Please try again later.");
  }
}

// Function to generate quiz questions
export async function generateQuizQuestions(
  topic: string, 
  difficulty: string = "medium", 
  numberOfQuestions: number = 5
): Promise<any> {
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
      const error = await response.json();
      throw new Error(error.error || 'Failed to generate quiz questions');
    }

    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error("Error generating quiz questions:", error);
    throw new Error("Failed to generate quiz questions. Please try again later.");
  }
}

// Function to generate image prompts for DALL-E
export async function generateImagePrompt(description: string): Promise<string> {
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
      const error = await response.json();
      throw new Error(error.error || 'Failed to generate image prompt');
    }

    const data = await response.json();
    return data.result || "";
  } catch (error) {
    console.error("Error generating image prompt:", error);
    throw new Error("Failed to generate image prompt. Please try again later.");
  }
}

// Function to generate an actual image using DALL-E
export async function generateImage(prompt: string): Promise<string> {
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
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to generate image');
    }

    const data = await response.json();
    return data.result || "";
  } catch (error) {
    console.error("Error generating image:", error);
    throw new Error("Failed to generate image. Please try again later.");
  }
}

// Function to generate video script
export async function generateVideoScript(
  topic: string, 
  duration: string = "5 minutes", 
  audience: string = "students"
): Promise<string> {
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
      const error = await response.json();
      throw new Error(error.error || 'Failed to generate video script');
    }

    const data = await response.json();
    return data.result || "";
  } catch (error) {
    console.error("Error generating video script:", error);
    throw new Error("Failed to generate video script. Please try again later.");
  }
} 