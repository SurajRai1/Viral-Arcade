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
          content: "You are a social media trend expert. Generate a short, funny, and engaging viral trend idea that would be popular on social media. Include a name, description, and difficulty level (1-5). Keep it clean and family-friendly."
        }
      ],
      max_tokens: 100,
      temperature: 0.8,
    });

    const trendText = response.choices[0]?.message?.content?.trim() || "The Impossible Dance Challenge: Try to dance without moving any limbs! Difficulty: 3";
    
    // Parse the trend text into structured data
    let trend;
    try {
      // Attempt to extract trend components
      const namePart = trendText.split(':')[0];
      const restPart = trendText.split(':')[1];
      const descriptionPart = restPart.split('Difficulty')[0];
      const difficultyPart = parseInt(restPart.match(/Difficulty: (\d)/)?.[1] || '3');

      trend = {
        id: `trend-${Date.now()}`,
        name: namePart.trim(),
        description: descriptionPart.trim(),
        difficulty: difficultyPart,
        year: new Date().getFullYear()
      };
    } catch (error) {
      // Fallback if parsing fails
      trend = {
        id: `trend-${Date.now()}`,
        name: "The Impossible Challenge",
        description: "Everyone's doing it, but should you?",
        difficulty: 3,
        year: new Date().getFullYear()
      };
    }
    
    return NextResponse.json({ trend });
  } catch (error) {
    console.error("Error generating trend:", error);
    
    // Fallback trends in case API fails
    const fallbackTrends = [
      {
        id: `trend-${Date.now()}`,
        name: "The Impossible Challenge",
        description: "Everyone's doing it, but should you?",
        difficulty: 3,
        year: new Date().getFullYear()
      },
      {
        id: `trend-${Date.now()}`,
        name: "Virtual Fashion Revolution",
        description: "Digital clothes are the new black!",
        difficulty: 2,
        year: new Date().getFullYear()
      },
      {
        id: `trend-${Date.now()}`,
        name: "The Anti-Trend Movement",
        description: "Being trendy is so last year. Join the resistance!",
        difficulty: 4,
        year: new Date().getFullYear()
      }
    ];
    
    const randomTrend = fallbackTrends[Math.floor(Math.random() * fallbackTrends.length)];
    return NextResponse.json({ trend: randomTrend });
  }
} 