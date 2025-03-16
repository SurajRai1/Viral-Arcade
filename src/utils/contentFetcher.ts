import { jokes } from '@/data/jokes';

/**
 * Fetch a joke from OpenAI or fallback to static jokes
 */
export async function fetchJoke(): Promise<string> {
  try {
    const response = await fetch('/api/jokes');
    const data = await response.json();
    
    if (!data.joke) {
      throw new Error('No joke returned from API');
    }
    
    return data.joke;
  } catch (error) {
    console.warn('Error fetching joke from API, using fallback:', error);
    // Return a random joke from our static collection
    return jokes[Math.floor(Math.random() * jokes.length)];
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
 * Get random content (joke or roast)
 */
export async function getRandomContent(): Promise<{ type: 'joke' | 'roast' | 'memeText', content: string }> {
  try {
    // 70% chance for jokes, 30% chance for roasts
    const isJoke = Math.random() < 0.7;
    
    if (isJoke) {
      const joke = await fetchJoke();
      return { type: 'joke', content: joke };
    } else {
      const response = await fetch('/api/roasts');
      const data = await response.json();
      
      if (!data.roast) {
        throw new Error('No roast returned from API');
      }
      
      return { type: 'roast', content: data.roast };
    }
  } catch (error) {
    console.warn('Error fetching content, using fallback:', error);
    // Always fallback to a joke if there's an error
    return { 
      type: 'joke', 
      content: jokes[Math.floor(Math.random() * jokes.length)]
    };
  }
} 