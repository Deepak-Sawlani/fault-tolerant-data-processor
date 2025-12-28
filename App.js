import React, { useState, useEffect } from 'react';
import EventForm from './components/EventForm';
import EventsList from './components/EventsList';
import Aggregates from './components/Aggregates';
import './App.css';

function App() {
  const [events, setEvents] = useState([]);
  const [aggregates, setAggregates] = useState({});

  const fetchData = async () => {
    const eventsRes = await fetch('/events');
    const eventsData = await eventsRes.json();
    setEvents(eventsData);

    const aggRes = await fetch('/aggregate');
    const aggData = await aggRes.json();
    setAggregates(aggData);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="App">
      <h1>Fault-Tolerant Data Processor</h1>
      
      <EventForm onSubmit={fetchData} />
      
      <div className="dashboard">
        <Aggregates data={aggregates} />
        <EventsList events={events} />
      </div>
    </div>
  );
}

export default App;
