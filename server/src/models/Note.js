import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    title:   { type: String, required: true, trim: true },
    content: { type: String, required: true, trim: true },
    tags:    { type: [String], default: [] },
  },
  { timestamps: true }
);

// Make responses look like { id, ... } instead of _id/__v
noteSchema.set('toJSON', {
  transform(_doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

// Useful index for listing newest first per user
noteSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model('Note', noteSchema);
