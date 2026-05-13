import mongoose from 'mongoose';

const thumbnailSchema = new mongoose.Schema({
  prompt: { type: String, required: true },
  imageUrl: { type: String, default: '' },
  imageData: { type: String, default: '' },
  script: { type: mongoose.Schema.Types.ObjectId, ref: 'Script', default: null },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
}, { timestamps: true });

thumbnailSchema.index({ user: 1, createdAt: -1 });

export default mongoose.model('Thumbnail', thumbnailSchema);
