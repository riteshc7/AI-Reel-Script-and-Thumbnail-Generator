import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { generateFullScript } from '../services/scriptGenerator.js';
import { generateTrendingTopics, generateScriptIdeas } from '../services/gemini.js';
import Script from '../models/Script.js';

const router = Router();

router.post('/generate', protect, async (req, res) => {
  try {
    const { topic, niche, platform, style } = req.body;
    if (!topic || !niche || !platform || !style) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const result = await generateFullScript({ topic, niche, platform, style });
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/save', protect, async (req, res) => {
  try {
    const script = await Script.create({ ...req.body, user: req.user._id });
    res.status(201).json(script);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/', protect, async (req, res) => {
  try {
    const { folder } = req.query;
    const filter = { user: req.user._id };
    if (folder) filter.folder = folder === 'null' ? null : folder;
    const scripts = await Script.find(filter).populate('folder', 'name color').sort({ createdAt: -1 });
    res.json(scripts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const script = await Script.findOne({ _id: req.params.id, user: req.user._id }).populate('folder', 'name color');
    if (!script) return res.status(404).json({ message: 'Script not found' });
    res.json(script);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const script = await Script.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!script) return res.status(404).json({ message: 'Script not found' });
    res.json(script);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/:id/duplicate', protect, async (req, res) => {
  try {
    const original = await Script.findOne({ _id: req.params.id, user: req.user._id });
    if (!original) return res.status(404).json({ message: 'Script not found' });

    const data = original.toObject();
    delete data._id;
    delete data.createdAt;
    delete data.updatedAt;
    data.title = `${data.title} (Copy)`;

    const duplicate = await Script.create(data);
    res.status(201).json(duplicate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const script = await Script.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!script) return res.status(404).json({ message: 'Script not found' });
    res.json({ message: 'Script deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/trending/:niche', protect, async (req, res) => {
  try {
    const topics = await generateTrendingTopics(req.params.niche);
    let parsed;
    try {
      const cleaned = topics.replace(/```json?/g, '').replace(/```/g, '').trim();
      parsed = JSON.parse(cleaned);
    } catch {
      parsed = topics.split('\n').filter(Boolean).map(t => t.replace(/^\d+[\.\)]\s*/, ''));
    }
    res.json(parsed);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/ideas/:niche/:platform', protect, async (req, res) => {
  try {
    const ideas = await generateScriptIdeas(req.params.niche, req.params.platform);
    let parsed;
    try {
      const cleaned = ideas.replace(/```json?/g, '').replace(/```/g, '').trim();
      parsed = JSON.parse(cleaned);
    } catch {
      parsed = ideas.split('\n').filter(Boolean).map(t => t.replace(/^\d+[\.\)]\s*/, ''));
    }
    res.json(parsed);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
