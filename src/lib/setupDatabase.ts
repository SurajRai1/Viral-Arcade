import { supabase } from './supabase';

/**
 * This script sets up the Supabase database schema for SpeedTap Arena.
 * It creates the leaderboard table if it doesn't exist.
 */
async function setupDatabase() {
  try {
    console.log('Setting up SpeedTap Arena database...');

    // Check if the leaderboard table exists
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'leaderboard');

    if (tablesError) {
      throw new Error(`Error checking tables: ${tablesError.message}`);
    }

    // If the leaderboard table doesn't exist, create it
    if (!tables || tables.length === 0) {
      console.log('Creating leaderboard table...');

      // Create the leaderboard table
      const { error: createError } = await supabase.rpc('create_leaderboard_table');

      if (createError) {
        throw new Error(`Error creating leaderboard table: ${createError.message}`);
      }

      console.log('Leaderboard table created successfully!');
    } else {
      console.log('Leaderboard table already exists.');
    }

    console.log('Database setup complete!');
  } catch (error) {
    console.error('Error setting up database:', error);
  }
}

// Run the setup function
setupDatabase();

// Export the function for use in other files
export default setupDatabase; 