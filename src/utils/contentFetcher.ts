/**
 * Fetch a joke from our API
 */
export async function fetchJoke(): Promise<string> {
  try {
    const response = await fetch('/api/jokes');
    const data = await response.json();
    return data.joke;
  } catch (error) {
    console.error("Error fetching joke:", error);
    // Fallback jokes
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
 * Fetch a roast from our API
 */
export async function fetchRoast(): Promise<string> {
  try {
    const response = await fetch('/api/roasts');
    const data = await response.json();
    return data.roast;
  } catch (error) {
    console.error("Error fetching roast:", error);
    // Fallback roasts
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

/**
 * Fetch meme text from our API
 */
export async function fetchMemeText(): Promise<string> {
  try {
    const response = await fetch('/api/memes');
    const data = await response.json();
    return data.memeText;
  } catch (error) {
    console.error("Error fetching meme text:", error);
    // Fallback meme captions
    const fallbackMemes = [
      "When you finally find the bug in your code and it was a missing semicolon",
      "Me trying to explain to my mom why I need a new gaming PC for 'school'",
      "That moment when you realize tomorrow is Monday, not Sunday",
      "Nobody: My brain at 3 AM: Remember that embarrassing thing from 7 years ago?",
      "When the WiFi drops for 0.0001 seconds and your whole life falls apart"
    ];
    return fallbackMemes[Math.floor(Math.random() * fallbackMemes.length)];
  }
}

/**
 * Get a random content item (joke, roast, or meme text)
 */
export async function getRandomContent(): Promise<{ type: 'joke' | 'roast' | 'memeText', content: string }> {
  const randomType = Math.floor(Math.random() * 3);
  
  switch (randomType) {
    case 0:
      return { type: 'joke', content: await fetchJoke() };
    case 1:
      return { type: 'roast', content: await fetchRoast() };
    case 2:
      return { type: 'memeText', content: await fetchMemeText() };
    default:
      return { type: 'joke', content: await fetchJoke() };
  }
} 