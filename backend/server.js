const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const { normalizeEvent } = require('./utils/normalizer');
const Event = require('./models/Event');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection (replace with your Atlas URL)
mongoose.connect('mongodb://localhost:27017/data-processor', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Ingest Event
app.post('/ingest', async (req, res) => {
  const { event, simulateFailure } = req.body;
  
  try {
    // Normalize event
    const normalized = normalizeEvent(event);
    
    // Simulate failure after normalization (but before DB write)
    if (simulateFailure) {
      throw new Error('Simulated database failure');
    }
    
    // Check for duplicate (idempotency)
    const existing = await Event.findOne({ processedId: normalized.processedId });
    if (existing) {
      return res.json({ success: true, message: 'Event already processed', event: existing });
    }
    
    // Save new event
    const saved = await new Event(normalized).save();
    res.json({ success: true, event: saved });
    
  } catch (error) {
    console.error('Ingestion error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get Events
app.get('/events', async (req, res) => {
  try {
    const events = await Event.find().sort({ timestamp: -1 }).limit(50);
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Aggregate
app.get('/aggregate', async (req, res) => {
  const { client, start, end } = req.query;
  
  try {
    const match = {};
    if (client) match.clientId = client;
    if (start || end) {
      match.timestamp = {};
      if (start) match.timestamp.$gte = new Date(start);
      if (end) match.timestamp.$lte = new Date(end);
    }
    
    const result = await Event.aggregate([
      { $match: match },
      {
        $group: {
          _id: null,
          total: { $sum: '$metric' },
          count: { $sum: 1 },
          avg: { $avg: '$metric' }
        }
      }
    ]);
    
    res.json(result[0] || { total: 0, count: 0, avg: 0 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
