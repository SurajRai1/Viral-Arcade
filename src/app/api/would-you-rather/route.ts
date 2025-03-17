import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const categories = [
  'Funny',
  'Adventure',
  'Superpowers',
  'Life Decisions',
  'Time Travel',
  'Food',
  'Career',
  'Technology'
];

export async function POST(req: Request) {
  try {
    const { category = 'random' } = await req.json();
    
    const selectedCategory = category === 'random' 
      ? categories[Math.floor(Math.random() * categories.length)]
      : category;

    const prompt = `Generate a creative and engaging "Would You Rather" question with two options. Make it ${selectedCategory.toLowerCase()} themed.
    Format: {
      "question": "Would you rather...",
      "optionA": {
        "text": "first option",
        "consequence": "interesting consequence or explanation"
      },
      "optionB": {
        "text": "second option",
        "consequence": "interesting consequence or explanation"
      },
      "funFact": "an interesting fact related to the question"
    }`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a creative game content generator specializing in creating engaging 'Would You Rather' scenarios."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 500
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error('No response from OpenAI');
    }

    try {
      const parsedResponse = JSON.parse(response);
      return NextResponse.json(parsedResponse);
    } catch (e) {
      // If JSON parsing fails, try to extract the content in a more lenient way
      const questionMatch = response.match(/"question":\s*"([^"]+)"/);
      const optionAMatch = response.match(/"text":\s*"([^"]+)".*?"consequence":\s*"([^"]+)"/);
      const optionBMatch = response.match(/"text":\s*"([^"]+)".*?"consequence":\s*"([^"]+)"/g)?.[1];
      const funFactMatch = response.match(/"funFact":\s*"([^"]+)"/);

      const formattedResponse = {
        question: questionMatch?.[1] || "Would you rather...",
        optionA: {
          text: optionAMatch?.[1] || "Option A",
          consequence: optionAMatch?.[2] || "Consequence A"
        },
        optionB: {
          text: optionBMatch?.match(/"text":\s*"([^"]+)"/)?.[1] || "Option B",
          consequence: optionBMatch?.match(/"consequence":\s*"([^"]+)"/)?.[1] || "Consequence B"
        },
        funFact: funFactMatch?.[1] || "Interesting fact about this choice..."
      };

      return NextResponse.json(formattedResponse);
    }
  } catch {
    return NextResponse.json(
      { error: 'Failed to generate question' },
      { status: 500 }
    );
  }
} 