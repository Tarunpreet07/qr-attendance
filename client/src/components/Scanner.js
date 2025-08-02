import React, { useEffect } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import API from '../api';
import { useParams } from 'react-router-dom';
import { getUser } from '../utils';

export default function Scanner() {
  const { sessionId } = useParams(); // renamed for clarity
  const user = getUser();

  useEffect(() => {
    const scanner = new Html5Qrcode("qr-reader");

    scanner.start(
      { facingMode: "environment" },
      { fps: 10, qrbox: 250 },
      async decodedText => {
        if (decodedText !== user.qrToken) {
          alert("Scanned QR does not match your QR token");
          scanner.stop();
          return;
        }

        try {
          await API.post('/api/attendance/mark', {
            sessionId,
            qrToken: decodedText
          });
          alert("✅ Attendance marked!");
          scanner.stop();
        } catch (err) {
          alert(err.response?.data?.message || "Error marking attendance");
          scanner.stop();
        }
      },
      err => {
        // Handle scan failure if needed
      }
    ).catch(console.error);

    return () => {
      scanner.stop().catch(console.error);
    };
  }, [sessionId, user]);

  return <div id="qr-reader" style={{ width: '300px', marginTop: '20px' }} />;
}
