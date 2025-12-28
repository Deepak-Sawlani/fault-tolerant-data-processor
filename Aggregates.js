import React from 'react';

function Aggregates({ data }) {
  return (
    <div className="card">
      <h3>Aggregates</h3>
      <div><strong>Total:</strong> {data.total?.toLocaleString() || 0}</div>
      <div><strong>Count:</strong> {data.count || 0}</div>
      <div><strong>Average:</strong> {(data.avg || 0).toFixed(2)}</div>
    </div>
  );
}

export default Aggregates;
