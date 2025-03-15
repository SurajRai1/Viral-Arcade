import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function GET() {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a meme creator. Generate a short, funny meme caption that would make someone laugh. Keep it under 100 characters and make it universally relatable. Don't include any formatting, just the text."
        }
      ],
      max_tokens: 60,
      temperature: 0.9,
    });

    const memeText = response.choices[0]?.message?.content?.trim() || "When you finally find the bug in your code and it was a missing semicolon";
    
    return NextResponse.json({ memeText });
  } catch (error) {
    console.error("Error generating meme text:", error);
    
    // Fallback meme captions in case API fails
    const fallbackMemes = [
      "When you finally find the bug in your code and it was a missing semicolon",
      "Me trying to explain to my mom why I need a new gaming PC for 'school'",
      "That moment when you realize tomorrow is Monday, not Sunday",
      "Nobody: My brain at 3 AM: Remember that embarrassing thing from 7 years ago?",
      "When the WiFi drops for 0.0001 seconds and your whole life falls apart"
    ];
    
    const randomMeme = fallbackMemes[Math.floor(Math.random() * fallbackMemes.length)];
    return NextResponse.json({ memeText: randomMeme });
  }
} 