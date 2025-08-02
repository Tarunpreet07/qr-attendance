import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [form, setForm] = useState({ name: '', email: '' });
  const [qrUrl, setQrUrl] = useState('');
  const [existing, setExisting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Try to register the student (new user)
      const res = await axios.post('http://localhost:5000/api/auth/register', {
        ...form,
        role: 'student',
      });

      // Show the QR code received from backend
      setQrUrl(res.data.qrUrl);
      setExisting(false);
    } catch (err) {
      if (err.response && err.response.status === 409) {
        // Already exists: fetch existing QR
        const existingRes = await axios.post('http://localhost:5000/api/auth/get-qr', {
          email: form.email,
        });
        setQrUrl(existingRes.data.qrUrl);
        setExisting(true);
      } else {
        alert('Error: ' + err.message);
      }
    }
  };

  const goToHome = () => navigate('/home');

  return (
    <div className="form-container">
      {!qrUrl ? (
        <form onSubmit={handleSubmit}>
          <h2>{existing ? 'Fetch QR Code' : 'Student Registration'}</h2>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={form.name}
            required
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            required
            onChange={handleChange}
          />
          <button type="submit">{existing ? 'Get QR Code' : 'Register & Get QR'}</button>
        </form>
      ) : (
        <div>
          <h2>{existing ? 'Welcome Back!' : 'Registration Successful 🎉'}</h2>
          <p>Your QR Code (save or download):</p>
          <a href={qrUrl} download="your_qr.png">
            <img src={qrUrl} alt="QR Code" />
          </a>
          <br />
          <button onClick={goToHome}>Go to Home</button>
        </div>
      )}
    </div>
  );
}

export default Register;
