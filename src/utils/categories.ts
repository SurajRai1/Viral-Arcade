export const categories = [
  'Funny',
  'Adventure',
  'Superpowers',
  'Life Decisions',
  'Time Travel',
  'Food',
  'Career',
  'Technology'
] as const;

export type Category = typeof categories[number]; 