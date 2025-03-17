import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function GET() {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a hilarious comedian. Generate a short, clean, and extremely funny joke that would make anyone laugh. Keep it under 150 characters."
        }
      ],
      max_tokens: 100,
      temperature: 0.8,
    });

    const joke = response.choices[0]?.message?.content?.trim() || "Why did the chicken cross the road? To get to the other side!";
    
    return NextResponse.json({ joke });
  } catch (error) {
    console.error("Error generating joke:", error);
    
    // Fallback jokes in case API fails
    const fallbackJokes = [
      "I told my wife she was drawing her eyebrows too high. She looked surprised.",
      "Why don't scientists trust atoms? Because they make up everything!",
      "What do you call a fake noodle? An impasta!",
      "I'm reading a book about anti-gravity. It's impossible to put down!",
      "Did you hear about the mathematician who's afraid of negative numbers? He'll stop at nothing to avoid them."
    ];
    
    const randomJoke = fallbackJokes[Math.floor(Math.random() * fallbackJokes.length)];
    return NextResponse.json({ joke: randomJoke });
  }
} 