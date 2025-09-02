// models/Job.js
const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  employer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  skills: [{ type: String, index: true }], // tags
  salary: {
    min: { type: Number },
    max: { type: Number },
    currency: { type: String, default: 'INR' }
  },
  location: { type: String, index: true },
  remote: { type: Boolean, default: false },
  employmentType: { type: String, enum: ['full-time','part-time','contract','internship'], default: 'full-time' },
  active: { type: Boolean, default: true, index: true },
  closedAt: { type: Date },
  views: { type: Number, default: 0 },
}, { timestamps: true });

JobSchema.index({ title: 'text', description: 'text', skills: 1 }); 
export const Job = mongoose.model('Job', JobSchema);
