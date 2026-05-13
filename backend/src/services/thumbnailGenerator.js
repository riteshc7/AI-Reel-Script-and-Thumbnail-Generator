import { generateThumbnail } from './gemini.js';

export async function createThumbnail(prompt) {
  try {
    const imageData = await generateThumbnail(prompt);
    return {
      prompt,
      imageData: imageData || '',
      status: imageData ? 'completed' : 'failed',
    };
  } catch (error) {
    return {
      prompt,
      imageData: '',
      status: 'failed',
    };
  }
}
