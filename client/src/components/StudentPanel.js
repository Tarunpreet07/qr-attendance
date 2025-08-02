import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Html5Qrcode } from 'html5-qrcode';
import axios from 'axios';

function StudentPanel() {
  const { id } = useParams(); // sessionId
  const scannerRef = useRef(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const html5QrCode = new Html5Qrcode("qr-reader");

    Html5Qrcode.getCameras().then(devices => {
      if (devices.length) {
        html5QrCode.start(
          devices[0].id,
          { fps: 10, qrbox: { width: 250, height: 250 } },
          async qrCodeMessage => {
            try {
              const qrData = JSON.parse(qrCodeMessage);
              const email = qrData.email;

              const res = await axios.post('http://localhost:5000/api/attendance/mark', {
                sessionId: id,
                email
              });

              setMessage(res.data.message);
            } catch (err) {
              setMessage('Error marking attendance: ' + (err.response?.data?.message || err.message));
            }

            await html5QrCode.stop();
          },
          errorMessage => {}
        );
      }
    }).catch(err => console.error("Camera error:", err));

    return () => {
      html5QrCode.stop().catch(err => console.error('Stop error:', err));
    };
  }, [id]);

  return (
    <div>
      <h2>Mark Attendance for Session: {id}</h2>
      <div id="qr-reader" ref={scannerRef} style={{ width: '300px', height: '300px' }}></div>
      {message && <p>{message}</p>}
    </div>
  );
}

export default StudentPanel;
