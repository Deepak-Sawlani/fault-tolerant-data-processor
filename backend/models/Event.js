const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  clientId: { type: String, required: true, index: true },
  metric: { type: Number, required: true },
  timestamp: { type: Date, required: true, index: true },
  processedId: { type: String, required: true, unique: true },
  raw: { type: Object, default: {} }
}, { timestamps: true });

// Ensure unique index for idempotency
eventSchema.index({ processedId: 1 }, { unique: true });

module.exports = mongoose.model('Event', eventSchema);
