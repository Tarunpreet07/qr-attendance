// src/components/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', form);
      const { token, role, userId } = res.data;

      // Save login info to localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('userId', userId);

      // Redirect based on role
      if (role === 'teacher') {
        navigate('/admin');
      } else if (role === 'student') {
        navigate(`/student/${userId}`); // userId is studentId
      } else {
        setError('Unknown user role.');
      }
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 400) {
        setError('Invalid email or password.');
      } else {
        setError('Login failed. Please try again later.');
      }
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Login</button>
      </form>
      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
    </div>
  );
}

export default Login;
