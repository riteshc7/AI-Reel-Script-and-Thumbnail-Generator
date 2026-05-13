export function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function truncate(str, len = 100) {
  if (!str) return '';
  return str.length > len ? str.slice(0, len) + '...' : str;
}

export const PLATFORMS = [
  { value: 'instagram', label: 'Instagram Reels', color: 'bg-pink-600' },
  { value: 'tiktok', label: 'TikTok', color: 'bg-black' },
  { value: 'youtube-shorts', label: 'YouTube Shorts', color: 'bg-red-600' },
  { value: 'facebook', label: 'Facebook Reels', color: 'bg-blue-600' },
];

export const NICHES = [
  'Technology', 'Fitness', 'Food & Cooking', 'Travel', 'Fashion',
  'Education', 'Entertainment', 'Business', 'Art & Design', 'Music',
  'Gaming', 'Health & Wellness', 'Finance', 'Comedy', 'Lifestyle',
  'Sports', 'DIY & Crafts', 'Beauty', 'Parenting', 'Motivation',
];

export const STYLES = [
  'Educational', 'Entertaining', 'Inspirational', 'Dramatic',
  'Humorous', 'Emotional', 'Fast-paced', 'Storytelling',
  'Tutorial', 'Challenge', 'Reaction', 'Behind-the-scenes',
];
