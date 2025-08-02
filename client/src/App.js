// src/App.js
import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

import Register from './components/Register';
import Login from './components/Login';
import StudentDashboard from './components/StudentPanel';
import AdminDashboard from './components/AdminPanel';
import Home from './components/Home';
import Sessions from './components/Sessions'; // ✅ Session listing
import MarkAttendance from './components/MarkAttendance'; // ✅ QR attendance scanner

function App() {
  const location = useLocation();

  const hideNavbar = location.pathname === '/';

  const role = localStorage.getItem('role');
  const userId = localStorage.getItem('userId');

  return (
    <>

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Sessions List */}
        <Route path="/sessions" element={<Sessions />} />

        {/* Mark attendance by scanning student QR for a session */}
        <Route path="/session/:id" element={<MarkAttendance />} />

        {/* Admin Dashboard */}
        <Route
          path="/admin"
          element={role === 'teacher' ? <AdminDashboard /> : <Navigate to="/login" />}
        />

        {/* Student Dashboard */}
        <Route
          path="/student/:id"
          element={
            role === 'student' && userId ? <StudentDashboard /> : <Navigate to="/login" />
          }
        />
      </Routes>
    </>
  );
}

export default App;
