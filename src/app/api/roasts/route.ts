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
          content: "You are a comedy roast master. Generate a short, clean, and funny light-hearted roast that would make someone laugh but not feel hurt. Keep it under 150 characters and make it universally applicable."
        }
      ],
      max_tokens: 100,
      temperature: 0.8,
    });

    const roast = response.choices[0]?.message?.content?.trim() || "Your playlist is so bad, even Spotify started recommending therapy sessions.";
    
    return NextResponse.json({ roast });
  } catch (error) {
    console.error("Error generating roast:", error);
    
    // Fallback roasts in case API fails
    const fallbackRoasts = [
      "Your playlist is so bad, even Spotify started recommending therapy sessions.",
      "You're not lazy, you're just on energy-saving mode 24/7.",
      "Your fashion sense called. It's filing for a restraining order.",
      "You're not late, everyone else is just ridiculously early.",
      "Your cooking is so bad, the smoke alarm cheers you on when you enter the kitchen."
    ];
    
    const randomRoast = fallbackRoasts[Math.floor(Math.random() * fallbackRoasts.length)];
    return NextResponse.json({ roast: randomRoast });
  }
} 