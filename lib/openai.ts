import OpenAI from 'openai';

// Safe API key access - with fallbacks for when env vars aren't available
const getApiKey = () => {
  const key = process.env.NEXT_PUBLIC_OPENAI_API_KEY || '';
  
  // Log a debug message if key is missing, but don't throw an error
  if (!key || key.length < 10) {
    console.warn('NEXT_PUBLIC_OPENAI_API_KEY is missing or appears invalid. API calls will be simulated.');
    return null;
  }
  return key;
};

// Safely initialize OpenAI client - only if we have a key
let openai: OpenAI | null = null;
try {
  const apiKey = getApiKey();
  if (apiKey) {
    openai = new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true // Note: In production, use server-side API calls instead
    });
  }
} catch (error) {
  console.error("Error initializing OpenAI client:", error);
  // Don't throw, just log the error
}

// Function to check if the client is available before making any calls
const isClientAvailable = () => {
  return !!openai;
};

// Client-side helper functions for OpenAI content generation

// Function to generate text content
export async function generateTextContent(prompt: string): Promise<string> {
  if (!prompt) {
    console.error("No prompt provided for text generation");
    return "Please provide a topic to generate content.";
  }

  try {
    // Use a safe fetch with a timeout to prevent hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
    const response = await fetch('/api/openai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'text',
        prompt: prompt,
      }),
      signal: controller.signal
    }).catch(err => {
      console.error("Network error during fetch:", err);
      return null;
    });
    
    clearTimeout(timeoutId);
    
    if (!response) {
      return "Content generation failed due to network issues. Please try again.";
    }

    if (!response.ok) {
      // Try to get error details, but don't fail if that also errors
      let errorMessage = `Failed to generate content: ${response.status}`;
      try {
        const errorData = await response.json();
        if (errorData.error) errorMessage = errorData.error;
      } catch {}
      
      console.error(errorMessage);
      return "Content generation service is currently unavailable. Please try again later.";
    }

    // Safe JSON parsing
    let data;
    try {
      data = await response.json();
    } catch (err) {
      console.error("Error parsing JSON response:", err);
      return "Error processing the generated content. Please try again.";
    }
    
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
      title: "Sample Quiz",
      description: "Please provide a topic to generate questions.",
      questions: [
        { 
          question: "Sample Question", 
          options: ["Option 1", "Option 2", "Option 3", "Option 4"], 
          correctAnswerIndex: 0 
        }
      ]
    };
  }

  try {
    // Use a safe fetch with a timeout to prevent hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
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
      signal: controller.signal
    }).catch(err => {
      console.error("Network error during quiz generation fetch:", err);
      return null;
    });
    
    clearTimeout(timeoutId);
    
    if (!response) {
      return {
        title: `Quiz: ${topic}`,
        description: "Quiz generation failed due to network issues.",
        questions: [
          { 
            question: `Sample question about ${topic}?`, 
            options: ["Option 1", "Option 2", "Option 3", "Option 4"], 
            correctAnswerIndex: 0 
          }
        ]
      };
    }

    if (!response.ok) {
      // Try to get error details, but don't fail if that also errors
      let errorMessage = `Failed to generate quiz: ${response.status}`;
      try {
        const errorData = await response.json();
        if (errorData.error) errorMessage = errorData.error;
      } catch {}
      
      console.error(errorMessage);
      return {
        title: `Quiz: ${topic}`,
        description: "Quiz generation service is currently unavailable.",
        questions: [
          { 
            question: `Sample question about ${topic}?`, 
            options: ["Option 1", "Option 2", "Option 3", "Option 4"], 
            correctAnswerIndex: 0 
          }
        ]
      };
    }

    // Safe JSON parsing
    let data;
    try {
      data = await response.json();
    } catch (err) {
      console.error("Error parsing JSON response for quiz:", err);
      return {
        title: `Quiz: ${topic}`,
        description: "Error processing the quiz data.",
        questions: [
          { 
            question: `Sample question about ${topic}?`, 
            options: ["Option 1", "Option 2", "Option 3", "Option 4"], 
            correctAnswerIndex: 0 
          }
        ]
      };
    }
    
    if (!data.result) {
      return {
        title: `Quiz: ${topic}`,
        description: "No quiz data returned from API.",
        questions: [
          { 
            question: `Sample question about ${topic}?`, 
            options: ["Option 1", "Option 2", "Option 3", "Option 4"], 
            correctAnswerIndex: 0 
          }
        ]
      };
    }
    
    return data.result;
  } catch (error) {
    console.error("Error generating quiz questions:", error);
    // Return a fallback quiz structure instead of throwing
    return {
      title: `Quiz: ${topic}`,
      description: `Test your knowledge about ${topic}`,
      questions: [
        { 
          question: `Sample question about ${topic}?`, 
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
    // Use a safe fetch with a timeout to prevent hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000); // 20 second timeout
    
    const response = await fetch('/api/openai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'imagePrompt',
        prompt: description,
      }),
      signal: controller.signal
    }).catch(err => {
      console.error("Network error during image prompt fetch:", err);
      return null;
    });
    
    clearTimeout(timeoutId);
    
    if (!response) {
      return `Educational illustration of ${description} with vibrant colors`;
    }

    if (!response.ok) {
      console.error(`Failed to generate image prompt: ${response.status}`);
      return `Educational illustration of ${description} with engaging design`;
    }

    // Safe JSON parsing
    let data;
    try {
      data = await response.json();
    } catch (err) {
      console.error("Error parsing JSON response for image prompt:", err);
      return `Educational illustration of ${description}`;
    }
    
    return data.result || `An educational illustration about ${description}`;
  } catch (error) {
    console.error("Error generating image prompt:", error);
    // Return a fallback prompt instead of throwing
    return `An educational illustration about ${description} with vibrant colors and engaging design`;
  }
}

// Function to generate an actual image using DALL-E
export async function generateImage(prompt: string): Promise<string> {
  if (!prompt) {
    console.error("No prompt provided for image generation");
    return ""; // Return empty string to indicate failure
  }

  try {
    // Use a safe fetch with a timeout to prevent hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout for image generation
    
    const response = await fetch('/api/openai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'image',
        prompt: prompt,
      }),
      signal: controller.signal
    }).catch(err => {
      console.error("Network error during image generation fetch:", err);
      return null;
    });
    
    clearTimeout(timeoutId);
    
    if (!response) {
      console.error("Network failure during image generation");
      return ""; // Return empty string to indicate failure
    }

    if (!response.ok) {
      console.error(`Failed to generate image: ${response.status}`);
      return ""; // Return empty string to indicate failure
    }

    // Safe JSON parsing
    let data;
    try {
      data = await response.json();
    } catch (err) {
      console.error("Error parsing JSON response for image:", err);
      return ""; // Return empty string to indicate failure
    }
    
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
    // Use a safe fetch with a timeout to prevent hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
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
      signal: controller.signal
    }).catch(err => {
      console.error("Network error during video script fetch:", err);
      return null;
    });
    
    clearTimeout(timeoutId);
    
    if (!response) {
      return `Video Script: ${topic}\n\nUnable to generate a complete script due to network issues. Please try again.`;
    }

    if (!response.ok) {
      console.error(`Failed to generate video script: ${response.status}`);
      return `Video Script: ${topic}\n\nVideo script generation service is currently unavailable. Please try again later.`;
    }

    // Safe JSON parsing
    let data;
    try {
      data = await response.json();
    } catch (err) {
      console.error("Error parsing JSON response for video script:", err);
      return `Video Script: ${topic}\n\nError processing the script. Please try again.`;
    }
    
    return data.result || `Video Script: ${topic}\n\nCould not generate a video script. Please try again with a different topic.`;
  } catch (error) {
    console.error("Error generating video script:", error);
    // Return a fallback message instead of throwing
    return `Video Script: ${topic}\n\nVideo script generation failed. Please try again later.`;
  }
} 