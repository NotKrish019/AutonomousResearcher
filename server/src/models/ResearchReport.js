import mongoose from 'mongoose';

const researchReportSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true },
  topic: { type: String, required: true },
  depth: { type: String, enum: ['quick', 'deep'], default: 'deep' },
  subtopics: [{ type: String }],
  researchNotes: [
    {
      subtopic: String,
      sourceUrl: String,
      facts: String,
      title: String
    }
  ],
  finalReport: { type: String, required: true },
  sources: [
    {
      title: String,
      url: String,
      snippet: String
    }
  ],
  metadata: {
    reflectionCount: { type: Number, default: 0 },
    executionTimeMs: { type: Number },
    completedAt: { type: Date, default: Date.now }
  },
  createdAt: { type: Date, default: Date.now }
});

export const ResearchReport = mongoose.model('ResearchReport', researchReportSchema);
