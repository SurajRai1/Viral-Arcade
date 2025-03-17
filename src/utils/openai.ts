import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Allow client-side usage
});

/**
 * Generate a funny joke using OpenAI
 */
export async function generateJoke(): Promise<string> {
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

    return response.choices[0]?.message?.content?.trim() || "Why did the chicken cross the road? To get to the other side!";
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
    return fallbackJokes[Math.floor(Math.random() * fallbackJokes.length)];
  }
}

/**
 * Generate a funny roast using OpenAI
 */
export async function generateRoast(): Promise<string> {
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

    return response.choices[0]?.message?.content?.trim() || "Your playlist is so bad, even Spotify started recommending therapy sessions.";
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
    return fallbackRoasts[Math.floor(Math.random() * fallbackRoasts.length)];
  }
} 