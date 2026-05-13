import mongoose from 'mongoose';

const sceneSchema = new mongoose.Schema({
  sceneNumber: Number,
  duration: String,
  visual: String,
  audio: String,
  text: String,
});

const scriptSchema = new mongoose.Schema({
  title: { type: String, required: true },
  topic: { type: String, required: true },
  niche: { type: String, required: true },
  platform: { type: String, required: true, enum: ['instagram', 'tiktok', 'youtube-shorts', 'facebook'] },
  style: { type: String, required: true },
  hook: { type: String, required: true },
  script: { type: String, required: true },
  scenes: [sceneSchema],
  cta: { type: String, required: true },
  hashtags: [String],
  viralScore: { type: Number, default: null },
  caption: { type: String, default: '' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  folder: { type: mongoose.Schema.Types.ObjectId, ref: 'Folder', default: null },
}, { timestamps: true });

scriptSchema.index({ user: 1, createdAt: -1 });

export default mongoose.model('Script', scriptSchema);
