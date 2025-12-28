import React, { useState } from 'react';
import axios from 'axios';

function EventForm({ onSubmit }) {
  const [event, setEvent] = useState({
    source: 'clientA',
    amount: 1200,
    timestamp: '20240101'
  });
  const [simulateFailure, setSimulateFailure] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      await axios.post('/ingest', { event, simulateFailure });
      setMessage('Event processed successfully!');
      onSubmit();
    } catch (error) {
      setMessage(`Error: ${error.response?.data?.error || error.message}`);
    }
  };

  return (
    <div className="card">
      <h2>Submit Raw Event</h2>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="source/client"
          value={event.source}
          onChange={(e) => setEvent({...event, source: e.target.value})}
        />
        <input
          type="number"
          placeholder="amount/value"
          value={event.amount}
          onChange={(e) => setEvent({...event, amount: e.target.value})}
        />
        <input
          placeholder="timestamp (20240101)"
          value={event.timestamp}
          onChange={(e) => setEvent({...event, timestamp: e.target.value})}
        />
        <label>
          <input
            type="checkbox"
            checked={simulateFailure}
            onChange={(e) => setSimulateFailure(e.target.checked)}
          />
          Simulate Failure
        </label>
        <button type="submit">Ingest Event</button>
      </form>
      {message && <div className={message.includes('Error') ? 'error' : 'success'}>{message}</div>}
    </div>
  );
}

export default EventForm;
