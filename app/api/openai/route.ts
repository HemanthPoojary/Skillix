import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, prompt, options } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    let result;

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

  return completion.choices[0].message.content;
}

// Quiz questions generation
async function generateQuizQuestions(topic: string, options: any = {}) {
  const difficulty = options.difficulty || "medium";
  const numberOfQuestions = options.numberOfQuestions || 5;

  const prompt = `Create ${numberOfQuestions} multiple-choice ${difficulty} difficulty quiz questions about ${topic}. 
  Format as JSON array with each question having: questionText, options (array of 4 choices), and correctAnswerIndex (0-3).`;

  const completion = await openai.chat.completions.create({
    model: options.model || "gpt-3.5-turbo",
    messages: [
      { 
        role: "system", 
        content: "You are an educational quiz creator who generates accurate multiple-choice questions with exactly 4 options per question." 
      },
      { role: "user", content: prompt }
    ],
    max_tokens: options.maxTokens || 1000,
    temperature: options.temperature || 0.7,
    response_format: { type: "json_object" },
  });

  const content = completion.choices[0].message.content || "";
  return JSON.parse(content);
}

// Image prompt generation
async function generateImagePrompt(description: string) {
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

  return completion.choices[0].message.content;
}

// Image generation
async function generateImage(prompt: string) {
  const response = await openai.images.generate({
    model: "dall-e-3",
    prompt: prompt,
    n: 1,
    size: "1024x1024",
  });

  return response.data[0].url;
}

// Video script generation
async function generateVideoScript(topic: string, options: any = {}) {
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

  return completion.choices[0].message.content;
} 