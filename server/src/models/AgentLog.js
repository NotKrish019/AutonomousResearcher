import mongoose from 'mongoose';

const agentLogSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, index: true },
  timestamp: { type: Date, default: Date.now },
  agent: { type: String, required: true },
  message: { type: String, required: true },
  level: { type: String, enum: ['info', 'warn', 'error', 'thought'], default: 'info' },
  data: { type: mongoose.Schema.Types.Mixed }
});

export const AgentLog = mongoose.model('AgentLog', agentLogSchema);
