// src/components/Home.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Welcome to QR Attendance System</h1>
      <button onClick={() => navigate('/register')} style={{ margin: '20px' }}>
        Get QR Code
      </button>
      <button onClick={() => navigate('/sessions')} style={{ margin: '20px' }}>
        Mark Attendance
      </button>
    </div>
  );
}

export default Home;
