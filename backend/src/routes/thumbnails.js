import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { createThumbnail } from '../services/thumbnailGenerator.js';
import Thumbnail from '../models/Thumbnail.js';

const router = Router();

router.post('/generate', protect, async (req, res) => {
  try {
    const { prompt, scriptId } = req.body;
    if (!prompt) return res.status(400).json({ message: 'Prompt is required' });

    const thumbnail = await Thumbnail.create({
      prompt,
      user: req.user._id,
      script: scriptId || null,
      status: 'pending',
    });

    const result = await createThumbnail(prompt);

    thumbnail.imageData = result.imageData;
    thumbnail.status = result.status;
    await thumbnail.save();

    res.json(thumbnail);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/', protect, async (req, res) => {
  try {
    const thumbnails = await Thumbnail.find({ user: req.user._id })
      .populate('script', 'title')
      .sort({ createdAt: -1 });
    res.json(thumbnails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const thumb = await Thumbnail.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!thumb) return res.status(404).json({ message: 'Thumbnail not found' });
    res.json({ message: 'Thumbnail deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
