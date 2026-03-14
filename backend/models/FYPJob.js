const mongoose = require('mongoose');

const FYPJobSchema = new mongoose.Schema({
  jobId: { type: String, required: true, unique: true },
  jobName: { type: String, required: true },
  priority: { type: Number, default: 1 },
  color: { type: String, default: '#10b981' },
  operations: [{
    machineId: String,
    duration: Number,
    task: String
  }]
});

module.exports = mongoose.model('FYPJob', FYPJobSchema);
