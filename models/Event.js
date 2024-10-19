const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  start: { type: Date, required: true },
  end: { type: Date, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  color: { type: String, default: '#007bff' },
  title: { type: String, default: 'Work' },
});

module.exports = mongoose.model('WorkEvent', EventSchema);
