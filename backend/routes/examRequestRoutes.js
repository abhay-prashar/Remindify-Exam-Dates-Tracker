
import express from 'express';
import ExamRequest from '../models/examRequest.js';
import Exam from '../models/exams.js';
import { adminAuth } from '../middleware/adminAuth.js';
const router = express.Router();

// Admin: edit a request
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const { subject, description, date, remark } = req.body;
    const updated = await ExamRequest.findByIdAndUpdate(
      req.params.id,
      { subject, description, date, remark },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Request not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// User submits a new exam request
router.post('/', async (req, res) => {
  try {
    const { subject, date, description, requestedBy, remark } = req.body;
    const newRequest = new ExamRequest({ subject, date, description, requestedBy, remark });
    await newRequest.save();
    res.status(201).json({ message: 'Exam request submitted and pending admin approval.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: get all exam requests
router.get('/', adminAuth, async (req, res) => {
  try {
    const requests = await ExamRequest.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: approve a request (creates an exam)
router.post('/:id/approve', adminAuth, async (req, res) => {
  try {
    const request = await ExamRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ error: 'Request not found' });
    // Create exam (use correct fields for Exam model)
    const exam = new Exam({ subject: request.subject, date: request.date, type: request.description });
    await exam.save();
    request.status = 'approved';
    await request.save();
    res.json({ message: 'Request approved and exam added.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: reject a request (delete it)
router.post('/:id/reject', adminAuth, async (req, res) => {
  try {
    const deleted = await ExamRequest.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Request not found' });
    res.json({ message: 'Request rejected and deleted.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: delete a request
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    await ExamRequest.findByIdAndDelete(req.params.id);
    res.json({ message: 'Request deleted.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
