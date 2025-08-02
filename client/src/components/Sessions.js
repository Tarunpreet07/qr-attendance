// frontend/src/pages/Sessions.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';


function Sessions() {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/sessions')
      .then(res => setSessions(res.data))
      .catch(err => console.error('Error fetching sessions:', err));
  }, []);

  return (
    <div>
      <h2>Available Sessions</h2>
      {sessions.length === 0 ? (
        <p>No sessions found.</p>
      ) : (
        <ul>
          {sessions.map(session => (
            <li key={session._id}>
              {session.title} – 
              <Link to={`/session/${session._id}`}> Mark Attendance</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Sessions;
