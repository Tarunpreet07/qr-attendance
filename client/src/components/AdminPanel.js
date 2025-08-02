// For admin
import React, { useState, useEffect } from 'react';
import API from '../api';

export default function AdminPanel() {
  const [sessions, setSessions] = useState([]);
  const [title, setTitle] = useState('');

  useEffect(() => {
    API.get('/sessions').then(r => setSessions(r.data));
  }, []);

  const create = () => {
    API.post('/sessions/create', { title }).then(r => {
      setSessions([r.data.session, ...sessions]);
      setTitle('');
    });
  };

  return (
    <div>
      <h2>Admin Panel</h2>
      <input value={title} placeholder="Session Title" onChange={e => setTitle(e.target.value)} />
      <button onClick={create}>Create Session</button>
      <ul>
        {sessions.map(s => (
          <li key={s._id}>
            {s.title} (Code: {s.sessionCode})
            <button onClick={() => API.get(`/attendance/list/${s._id}`).then(r => alert(JSON.stringify(r.data)))}>
              View Attendance
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
