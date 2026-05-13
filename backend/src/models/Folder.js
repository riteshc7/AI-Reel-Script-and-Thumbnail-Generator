import mongoose from 'mongoose';

const folderSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  color: { type: String, default: '#6366f1' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

folderSchema.index({ user: 1, name: 1 }, { unique: true });

export default mongoose.model('Folder', folderSchema);
