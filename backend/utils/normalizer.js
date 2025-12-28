const { v4: uuidv4 } = require('uuid');

function parseTimestamp(ts) {
  // if nothing sent, use current time
  if (!ts) return new Date();

  // if format like 20240101 (YYYYMMDD)
  if (/^\d{8}$/.test(ts)) {
    const year = ts.slice(0, 4);
    const month = ts.slice(4, 6);
    const day = ts.slice(6, 8);
    return new Date(`${year}-${month}-${day}T00:00:00Z`);
  }

  // try normal Date parsing
  const d = new Date(ts);
  // if invalid, fallback to now
  if (isNaN(d.getTime())) {
    return new Date();
  }
  return d;
}

function normalizeEvent(rawEvent) {
  const ts = parseTimestamp(rawEvent.timestamp);

  return {
    clientId: rawEvent.source || rawEvent.client || 'unknown',
    metric: parseFloat(rawEvent.value || rawEvent.amount || 0) || 0,
    timestamp: ts,                // store as Date object
    processedId: uuidv4(),
    raw: rawEvent
  };
}

module.exports = { normalizeEvent };
