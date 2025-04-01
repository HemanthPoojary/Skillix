import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Get API key from environment variables
const apiKey = process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY;

// Check if API key is available
if (!apiKey) {
  console.error('Missing OpenAI API key. Please set OPENAI_API_KEY in environment variables.');
}

// Initialize OpenAI client only if API key is available
let openai: OpenAI | null = null;
try {
  if (apiKey) {
    openai = new OpenAI({
      apiKey: apiKey,
    });
  }
} catch (error) {
  console.error('Failed to initialize OpenAI client:', error);
}

export async function POST(request: Request) {
  // Check if OpenAI client is initialized
  if (!openai) {
    return NextResponse.json(
      { error: 'OpenAI API key is missing or invalid' },
      { status: 500 }
    );
  }

  try {
    // Parse the request body with error handling
    let body;
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    const { type, prompt, options } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    let result;

    try {
      switch (type) {
        case 'text':
          result = await generateTextContent(prompt, options);
          break;
        case 'quiz':
          result = await generateQuizQuestions(prompt, options);
          break;
        case 'imagePrompt':
          result = await generateImagePrompt(prompt);
          break;
        case 'image':
          result = await generateImage(prompt);
          break;
        case 'video':
          result = await generateVideoScript(prompt, options);
          break;
        default:
          return NextResponse.json(
            { error: 'Invalid generation type' },
            { status: 400 }
          );
      }
    } catch (error: any) {
      console.error(`Error generating ${type} content:`, error);
      return NextResponse.json(
        { error: `Failed to generate ${type} content: ${error.message}` },
        { status: 500 }
      );
    }

    if (!result) {
      return NextResponse.json(
        { error: 'Generation produced no result' },
        { status: 500 }
      );
    }

    return NextResponse.json({ result });
  } catch (error: any) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process request' },
      { status: 500 }
    );
  }
}

// Text content generation
async function generateTextContent(prompt: string, options: any = {}) {
  if (!openai) throw new Error('OpenAI client not initialized');
  
  try {
    const completion = await openai.chat.completions.create({
      model: options.model || "gpt-3.5-turbo",
      messages: [
        { 
          role: "system", 
          content: "You are an educational content creator. Create engaging, accurate, and age-appropriate educational content." 
        },
        { role: "user", content: prompt }
      ],
      max_tokens: options.maxTokens || 800,
      temperature: options.temperature || 0.7,
    });

    return completion.choices[0]?.message?.content || "Failed to generate content.";
  } catch (error) {
    console.error("Text generation error:", error);
    throw new Error("Text generation failed. Please try again.");
  }
}

// Quiz questions generation
async function generateQuizQuestions(topic: string, options: any = {}) {
  if (!openai) throw new Error('OpenAI client not initialized');
  
  try {
    const difficulty = options.difficulty || "medium";
    const numberOfQuestions = options.numberOfQuestions || 5;

    const prompt = `Create a quiz titled "Quiz: ${topic}" with ${numberOfQuestions} multiple-choice ${difficulty} difficulty questions about ${topic}. 
    Format the response as a JSON object with:
    1. "title": A catchy title for this quiz
    2. "description": A brief description of what the quiz covers
    3. "questions": An array of questions, where each question has:
       - "question": The question text
       - "options": Array of exactly 4 answer choices
       - "correctAnswerIndex": Index (0-3) of the correct answer
    
    Make sure the questions are educational, engaging, and appropriate for the topic.`;

    const completion = await openai.chat.completions.create({
      model: options.model || "gpt-3.5-turbo",
      messages: [
        { 
          role: "system", 
          content: "You are an educational quiz creator who generates accurate, engaging multiple-choice questions with exactly 4 options per question. You always format responses as valid JSON." 
        },
        { role: "user", content: prompt }
      ],
      max_tokens: options.maxTokens || 1500,
      temperature: options.temperature || 0.7,
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0]?.message?.content || "";
    if (!content) {
      throw new Error("Quiz generation failed: Empty response");
    }
    
    try {
      const parsedContent = JSON.parse(content);
      
      // Ensure the response has the expected format
      if (!parsedContent.questions || !Array.isArray(parsedContent.questions)) {
        // If not in expected format, restructure it
        return {
          title: parsedContent.title || `Quiz: ${topic}`,
          description: parsedContent.description || `Test your knowledge about ${topic}`,
          questions: parsedContent.questions || [
            {
              question: `What is ${topic}?`,
              options: ["Option 1", "Option 2", "Option 3", "Option 4"],
              correctAnswerIndex: 0
            }
          ]
        };
      }
      
      return parsedContent;
    } catch (parseError) {
      console.error("Failed to parse quiz JSON:", parseError);
      // Return a fallback structure instead of throwing an error
      return {
        title: `Quiz: ${topic}`,
        description: `Test your knowledge about ${topic}`,
        questions: [
          {
            question: `What is ${topic}?`,
            options: ["Option 1", "Option 2", "Option 3", "Option 4"],
            correctAnswerIndex: 0
          }
        ]
      };
    }
  } catch (error) {
    console.error("Quiz generation error:", error);
    // Return a fallback structure instead of throwing
    return {
      title: `Quiz: ${topic}`,
      description: `Test your knowledge about ${topic}`,
      questions: [
        {
          question: `What is ${topic}?`,
          options: ["Option 1", "Option 2", "Option 3", "Option 4"],
          correctAnswerIndex: 0
        }
      ]
    };
  }
}

// Image prompt generation
async function generateImagePrompt(description: string) {
  if (!openai) throw new Error('OpenAI client not initialized');
  
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { 
          role: "system", 
          content: "You create detailed image generation prompts for educational content. Focus on clarity, educational value, and visual appeal." 
        },
        { 
          role: "user", 
          content: `Create a detailed image generation prompt for DALL-E based on this description: ${description}` 
        }
      ],
      max_tokens: 200,
      temperature: 0.7,
    });

    return completion.choices[0]?.message?.content || "An educational illustration";
  } catch (error) {
    console.error("Image prompt generation error:", error);
    throw new Error("Image prompt generation failed. Please try again.");
  }
}

// Image generation
async function generateImage(prompt: string) {
  if (!openai) throw new Error('OpenAI client not initialized');
  
  try {
    // Ensure the prompt is safe and educational
    const safePrompt = `Educational illustration: ${prompt}. Keep the image appropriate for all ages and educational in nature.`;
    
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: safePrompt,
      n: 1,
      size: "1024x1024",
    });

    if (!response.data || response.data.length === 0 || !response.data[0].url) {
      throw new Error("Image generation failed: No image URL in response");
    }

    return response.data[0].url;
  } catch (error) {
    console.error("Image generation error:", error);
    throw new Error("Image generation failed. Please try again with a different prompt.");
  }
}

// Video script generation
async function generateVideoScript(topic: string, options: any = {}) {
  if (!openai) throw new Error('OpenAI client not initialized');
  
  try {
    const duration = options.duration || "5 minutes";
    const audience = options.audience || "students";

    const completion = await openai.chat.completions.create({
      model: options.model || "gpt-3.5-turbo",
      messages: [
        { 
          role: "system", 
          content: "You are an educational video script writer who creates engaging, clear scripts with appropriate pacing." 
        },
        { 
          role: "user", 
          content: `Write a script for a ${duration} educational video about ${topic} for ${audience}. Include an introduction, main points, and conclusion.` 
        }
      ],
      max_tokens: options.maxTokens || 1200,
      temperature: options.temperature || 0.7,
    });

    return completion.choices[0]?.message?.content || "Failed to generate video script.";
  } catch (error) {
    console.error("Video script generation error:", error);
    throw new Error("Video script generation failed. Please try again.");
  }
} 