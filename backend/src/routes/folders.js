import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import Folder from '../models/Folder.js';
import Script from '../models/Script.js';

const router = Router();

router.get('/', protect, async (req, res) => {
  try {
    const folders = await Folder.find({ user: req.user._id }).sort({ name: 1 });
    res.json(folders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const { name, color } = req.body;
    if (!name) return res.status(400).json({ message: 'Folder name is required' });
    const folder = await Folder.create({ name, color, user: req.user._id });
    res.status(201).json(folder);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Folder name already exists' });
    }
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const folder = await Folder.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { $set: req.body },
      { new: true }
    );
    if (!folder) return res.status(404).json({ message: 'Folder not found' });
    res.json(folder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const folder = await Folder.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!folder) return res.status(404).json({ message: 'Folder not found' });

    await Script.updateMany({ folder: folder._id }, { folder: null });

    res.json({ message: 'Folder deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
