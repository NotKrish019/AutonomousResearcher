import express from 'express';
import { ResearchReport } from '../models/ResearchReport.js';

const router = express.Router();

// Get all saved research reports
router.get('/', async (req, res) => {
  try {
    const reports = await ResearchReport.find()
      .select('sessionId topic depth subtopics createdAt metadata')
      .sort({ createdAt: -1 });
    return res.json({ success: true, count: reports.length, reports });
  } catch (error) {
    return res.json({ success: true, count: 0, reports: [] });
  }
});

// Get single report by sessionId
router.get('/:sessionId', async (req, res) => {
  try {
    const report = await ResearchReport.findOne({ sessionId: req.params.sessionId });
    if (!report) {
      return res.status(404).json({ error: 'Report not found.' });
    }
    return res.json({ success: true, report });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Delete report by sessionId
router.delete('/:sessionId', async (req, res) => {
  try {
    await ResearchReport.deleteOne({ sessionId: req.params.sessionId });
    return res.json({ success: true, message: 'Report deleted.' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;
