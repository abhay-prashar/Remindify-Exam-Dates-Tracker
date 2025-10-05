const mongoose = require('mongoose');

const examRequestSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  date: { type: Date, required: true },
  description: { type: String },
  remark: { type: String },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ExamRequest', examRequestSchema);