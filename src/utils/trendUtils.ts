/**
 * Fetch a new viral trend from the API
 */
export async function fetchTrend(): Promise<any> {
  try {
    const response = await fetch('/api/viral-trends');
    const data = await response.json();
    
    if (!data.trend) {
      throw new Error('No trend returned from API');
    }
    
    return data.trend;
  } catch (error) {
    console.warn('Error fetching trend from API, using fallback:', error);
    // Return a fallback trend
    return {
      id: `trend-${Date.now()}`,
      name: "The Impossible Challenge",
      description: "Everyone's doing it, but should you?",
      difficulty: 3,
      year: new Date().getFullYear()
    };
  }
}

/**
 * Calculate score based on time and cringe meter
 */
export function calculateScore(timeLeft: number, cringeMeter: number, difficulty: number): number {
  const timeBonus = timeLeft * 10;
  const cringePenalty = cringeMeter / 100;
  const difficultyMultiplier = 1 + (difficulty * 0.2);
  
  return Math.floor((timeBonus * (1 - cringePenalty)) * difficultyMultiplier);
}

/**
 * Get a random game tip
 */
export function getRandomTip(): string {
  const tips = [
    "Keep your distance from viral trends!",
    "The faster you move, the more cringe you accumulate.",
    "Some trends are more infectious than others.",
    "Watch your cringe meter - don't let it fill up!",
    "Higher difficulty means better score multipliers!",
    "Take breaks between levels to plan your strategy.",
    "Share your high scores to challenge friends!",
    "Each level has unique trend patterns to learn.",
    "Stay calm and focused to avoid trending content.",
    "Practice makes perfect - keep trying!"
  ];
  
  return tips[Math.floor(Math.random() * tips.length)];
}

/**
 * Check if a new high score was achieved
 */
export function isNewHighScore(score: number, previousHighScore: number): boolean {
  return score > (previousHighScore || 0);
}

/**
 * Format time for display
 */
export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

/**
 * Get difficulty label
 */
export function getDifficultyLabel(level: number): string {
  switch (level) {
    case 1:
      return '😌 Easy';
    case 2:
      return '😊 Normal';
    case 3:
      return '😅 Hard';
    case 4:
      return '😰 Expert';
    case 5:
      return '🤯 Impossible';
    default:
      return '😊 Normal';
  }
}

/**
 * Get achievement for score
 */
export function getAchievement(score: number): { title: string; description: string; icon: string } {
  if (score >= 2000) {
    return {
      title: 'Trend Transcender',
      description: 'You exist above the trends!',
      icon: '👑'
    };
  } else if (score >= 1500) {
    return {
      title: 'Viral Veteran',
      description: 'A master of trend evasion!',
      icon: '🌟'
    };
  } else if (score >= 1000) {
    return {
      title: 'Social Survivor',
      description: 'You escaped the viral vortex!',
      icon: '🏆'
    };
  } else if (score >= 500) {
    return {
      title: 'Trend Dodger',
      description: 'Getting better at avoiding trends!',
      icon: '🎯'
    };
  } else {
    return {
      title: 'Trend Novice',
      description: 'Keep practicing your escape skills!',
      icon: '🌱'
    };
  }
} 