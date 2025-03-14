# SpeedTap Arena

SpeedTap Arena is a fast-paced web game that challenges players' clicking or tapping speed in a very condensed timeframe. The entire game lasts just one second, making it perfect for quick gaming sessions and friendly competition.

## Core Concept

Players have exactly one second to tap or click as many times as possible. This extreme time constraint creates an intense, adrenaline-fueled experience that's perfect for quick gaming sessions and friendly competition.

## Key Features

- **Ultra-Short Gameplay**: The entire game lasts just one second, making it perfect for quick breaks or competition
- **Live Counter**: Players see their clicks accumulate in real-time as they tap
- **Leaderboard System**: Top scores are tracked with player names and dates
- **Rage Mode**: An additional challenge where obstacles appear that deduct points if clicked accidentally
- **Responsive Design**: Works perfectly on both desktop and mobile devices

## Technical Implementation

The game is built with modern web technologies:

- **Next.js**: For fast performance and easy deployment
- **React**: For responsive, component-based UI
- **Tailwind CSS**: For clean, modern styling
- **Supabase**: For backend database and leaderboard functionality

## Getting Started

### Prerequisites

- Node.js 18.0.0 or later
- npm or yarn
- A Supabase account for the leaderboard functionality

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/speedtap-arena.git
   cd speedtap-arena
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   - Create a `.env.local` file in the root directory
   - Add your Supabase credentials:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

4. Set up the Supabase database:
   - Create a new table called `leaderboard` with the following schema:
     ```sql
     CREATE TABLE leaderboard (
       id SERIAL PRIMARY KEY,
       player_name TEXT NOT NULL,
       score INTEGER NOT NULL,
       is_rage_mode BOOLEAN DEFAULT FALSE,
       created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
     );
     ```

5. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser to see the game.

## Deployment

The easiest way to deploy SpeedTap Arena is using Vercel:

1. Push your code to a GitHub repository
2. Import the project into Vercel
3. Add your environment variables in the Vercel dashboard
4. Deploy!

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by various speed-clicking games and challenges
- Built with Next.js, React, Tailwind CSS, and Supabase
