import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type Category = 'funny' | 'adventure' | 'superpowers' | 'life-decisions' | 'time-travel' | 'food' | 'career' | 'technology' | 'random';

const categoryPrompts: Record<Category, string> = {
  funny: 'Create a humorous and entertaining "Would You Rather" question that will make people laugh.',
  adventure: 'Create an exciting and adventurous "Would You Rather" question about thrilling experiences.',
  superpowers: 'Create a "Would You Rather" question about having different superpowers or abilities.',
  'life-decisions': 'Create a thought-provoking "Would You Rather" question about important life choices.',
  'time-travel': 'Create a "Would You Rather" question about different time travel scenarios.',
  food: 'Create a "Would You Rather" question about different food-related choices.',
  career: 'Create a "Would You Rather" question about different career paths or work situations.',
  technology: 'Create a "Would You Rather" question about different technology-related scenarios.',
  random: 'Create a random and unexpected "Would You Rather" question that could be funny, serious, or thought-provoking.',
};

export async function POST(request: Request) {
  try {
    const { category = 'random' } = await request.json();
    const prompt = categoryPrompts[category as Category] || categoryPrompts.random;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a creative "Would You Rather" question generator. Generate questions that are engaging, thought-provoking, and appropriate for all ages. Each question should have two distinct options with clear consequences. Format your response exactly like this:
          
Would you rather: [Your question here]
A. [First option]
B. [Second option]
Consequence A: [Consequence of first option]
Consequence B: [Consequence of second option]
Fun fact: [An interesting fact about the question or options]`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const response = completion.choices[0].message.content;
    if (!response) {
      throw new Error('No response from OpenAI');
    }

    // Parse the response into a structured format
    const lines = response.split('\n').filter(line => line.trim());
    
    // Validate the response format
    if (lines.length < 6) {
      throw new Error('Invalid response format from OpenAI');
    }

    const question = lines[0].replace(/^Would you rather:?\s*/i, '').trim();
    const optionA = lines[1]?.replace(/^A\.\s*/i, '').trim() || '';
    const optionB = lines[2]?.replace(/^B\.\s*/i, '').trim() || '';
    const consequenceA = lines[3]?.replace(/^Consequence A:\s*/i, '').trim() || '';
    const consequenceB = lines[4]?.replace(/^Consequence B:\s*/i, '').trim() || '';
    const funFact = lines[5]?.replace(/^Fun fact:\s*/i, '').trim() || '';

    // Validate the parsed data
    if (!question || !optionA || !optionB || !consequenceA || !consequenceB || !funFact) {
      throw new Error('Missing required fields in response');
    }

    return NextResponse.json({
      question,
      optionA: {
        text: optionA,
        consequence: consequenceA
      },
      optionB: {
        text: optionB,
        consequence: consequenceB
      },
      funFact
    });
  } catch (error) {
    console.error('Error generating question:', error);
    // Return a more detailed error message
    return NextResponse.json(
      { 
        error: 'Failed to generate question',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 