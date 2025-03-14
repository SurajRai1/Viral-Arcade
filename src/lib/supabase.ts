import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create the Supabase client with auth configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Use our custom callback URL for email confirmations
    redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : undefined,
  }
});

// Type for leaderboard entries
export type LeaderboardEntry = {
  id: number;
  player_name: string;
  score: number;
  is_rage_mode: boolean;
  created_at: string;
};

// Function to fetch leaderboard data
export async function getLeaderboard(limit = 10, isRageMode = false) {
  const { data, error } = await supabase
    .from('leaderboard')
    .select('*')
    .eq('is_rage_mode', isRageMode)
    .order('score', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching leaderboard:', error);
    return [];
  }

  return data as LeaderboardEntry[];
}

// Function to add a new score to the leaderboard
export async function addScore(playerName: string, score: number, isRageMode = false) {
  const { data, error } = await supabase
    .from('leaderboard')
    .insert([
      {
        player_name: playerName,
        score: score,
        is_rage_mode: isRageMode,
      },
    ])
    .select();

  if (error) {
    console.error('Error adding score:', error);
    return null;
  }

  return data?.[0] as LeaderboardEntry | null;
} 