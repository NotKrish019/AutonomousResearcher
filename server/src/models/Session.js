import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true },
  topic: { type: String, required: true },
  depth: { type: String, enum: ['quick', 'deep'], default: 'deep' },
  status: {
    type: String,
    enum: ['planning', 'researching', 'evaluating', 'writing', 'completed', 'error'],
    default: 'planning'
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const Session = mongoose.model('Session', sessionSchema);
