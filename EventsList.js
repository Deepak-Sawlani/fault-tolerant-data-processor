import React from 'react';

function EventsList({ events }) {
  const safeEvents = Array.isArray(events) ? events : [];

  return (
    <div className="card">
      <h3>Processed Events ({safeEvents.length})</h3>
      {safeEvents.map(event => {
        const dateObj = event.timestamp ? new Date(event.timestamp) : null;
        const displayTime =
          dateObj && !isNaN(dateObj.getTime())
            ? dateObj.toLocaleString()
            : 'No time';

        return (
          <div key={event._id} className="event-item">
            <strong>{event.clientId}</strong>: {event.metric}{' '}
            <span>@{displayTime}</span>
          </div>
        );
      })}
    </div>
  );
}

export default EventsList;
