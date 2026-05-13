import { generateHook, generateScript, generateHashtags, predictViralScore } from './gemini.js';

export async function generateFullScript({ topic, niche, platform, style }) {
  try {
    const hook = await generateHook(topic, niche, platform, style);
    const scriptRaw = await generateScript(topic, niche, platform, style, hook);
    let parsed;
    try {
      const cleaned = scriptRaw.replace(/```json?/g, '').replace(/```/g, '').trim();
      parsed = JSON.parse(cleaned);
    } catch {
      parsed = { title: topic, script: scriptRaw, scenes: [], cta: '', caption: '' };
    }

    const hashtagsRaw = await generateHashtags(topic, niche, platform);
    let hashtags = [];
    try {
      const cleaned = hashtagsRaw.replace(/```json?/g, '').replace(/```/g, '').trim();
      hashtags = JSON.parse(cleaned);
    } catch {
      hashtags = ['#viral', '#fyp', '#' + niche.replace(/\s+/g, '')];
    }

    const viralRaw = await predictViralScore(topic, niche, platform, style, hook);
    let viralScore = null;
    try {
      const cleaned = viralRaw.replace(/```json?/g, '').replace(/```/g, '').trim();
      const viral = JSON.parse(cleaned);
      viralScore = viral.score;
    } catch {
      viralScore = null;
    }

    return {
      title: parsed.title || topic,
      hook,
      script: parsed.script || '',
      scenes: parsed.scenes || [],
      cta: parsed.cta || '',
      caption: parsed.caption || '',
      hashtags,
      viralScore,
      topic,
      niche,
      platform,
      style,
    };
  } catch (error) {
    throw new Error(`Script generation failed: ${error.message}`);
  }
}
