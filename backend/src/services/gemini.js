import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const TEXT_MODEL = 'gemini-2.5-flash-lite';
const IMAGE_MODEL = 'gemini-2.5-flash-lite';

async function generateContent(prompt, modelName = TEXT_MODEL) {
  const model = genAI.getGenerativeModel({ model: modelName });
  const result = await model.generateContent(prompt);
  const response = result.response;
  return response.text();
}

async function generateImageContent(prompt) {
  const imagePrompt = `YouTube thumbnail for: ${prompt}. Bold colors, clear focal point, text overlay, high contrast, professional design, 16:9 aspect ratio`;
  const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(imagePrompt)}?width=1280&height=720&model=flux`;
  const response = await fetch(url);
  if (!response.ok) return null;
  const buffer = await response.arrayBuffer();
  const base64 = Buffer.from(buffer).toString('base64');
  return `data:image/jpeg;base64,${base64}`;
}

export async function generateHook(topic, niche, platform, style) {
  const prompt = `You are an expert social media copywriter. Generate ONE viral hook for a short-form video.

Topic: ${topic}
Niche: ${niche}
Platform: ${platform}
Style: ${style}

Rules:
- Hook must be under 15 words
- Must create curiosity or emotional trigger
- Platform-appropriate tone
- Return ONLY the hook text, no explanations`;

  return generateContent(prompt);
}

export async function generateScript(topic, niche, platform, style, hook) {
  const prompt = `You are a professional short-form video scriptwriter. Write a complete script.

Topic: ${topic}
Niche: ${niche}
Platform: ${platform}
Style: ${style}
Hook: "${hook}"

Return a JSON object (no markdown, no code fences) with this structure:
{
  "title": "A compelling video title (max 60 chars)",
  "script": "The full script text with natural speech patterns, timing notes in (parens)",
  "scenes": [
    {
      "sceneNumber": 1,
      "duration": "0:00-0:05",
      "visual": "what appears on screen",
      "audio": "voiceover or background audio description",
      "text": "on-screen text overlays"
    }
  ],
  "cta": "A compelling call to action (max 15 words)",
  "caption": "An engaging caption for the post (max 2200 chars)"
}

Generate 4-6 scenes. Keep the total video under 60 seconds.`;

  return generateContent(prompt);
}

export async function generateHashtags(topic, niche, platform) {
  const prompt = `You are a social media hashtag strategist. Generate hashtags for:

Topic: ${topic}
Niche: ${niche}
Platform: ${platform}

Return a JSON array of strings (no markdown, no code fences):
["hashtag1", "hashtag2", ...]

Rules:
- Mix of broad and niche-specific tags
- 10-15 hashtags total
- Platform-appropriate volume
- Include 2-3 viral/popular tags
- Include brandable tags`;

  return generateContent(prompt);
}

export async function predictViralScore(topic, niche, platform, style, hook) {
  const prompt = `You are a social media viral potential analyzer. Predict the viral potential.

Topic: ${topic}
Niche: ${niche}
Platform: ${platform}
Style: ${style}
Hook: "${hook}"

Return ONLY a JSON object (no markdown):
{
  "score": <number 0-100>,
  "factors": ["factor1", "factor2", "factor3"],
  "tips": ["tip1", "tip2"]
}

Consider: hook strength, trend alignment, platform algorithms, audience retention, shareability.`;

  return generateContent(prompt);
}

export async function generateTrendingTopics(niche) {
  const prompt = `You are a social media trend analyst. Generate 8 trending topic ideas for content creators in the "${niche}" niche.

Return ONLY a JSON array of strings (no markdown):
["topic1", "topic2", ...]

Rules:
- Each topic must be timely and engaging
- Mix of evergreen and trend-based topics
- Specific enough to create a short-form video about
- Include hooks and angles`;

  return generateContent(prompt);
}

export async function generateScriptIdeas(niche, platform) {
  const prompt = `You are a creative director for social media content. Generate 6 video ideas.

Niche: ${niche}
Platform: ${platform}

Return ONLY a JSON array of strings (no markdown):
["idea1", "idea2", ...]

Each idea should be a complete concept (title + brief angle).`;

  return generateContent(prompt);
}

export async function generateThumbnail(prompt) {
  return generateImageContent(prompt);
}

export { generateContent };
