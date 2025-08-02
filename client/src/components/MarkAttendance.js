import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { useParams } from 'react-router-dom';

const MarkAttendance = () => {
  const { id: sessionId } = useParams(); // Get sessionId from URL
  const [message, setMessage] = useState('');
  const [scanned, setScanned] = useState(false);
  const qrScannerRef = useRef(null);

  useEffect(() => {
    if (!sessionId) {
      setMessage("❌ Missing session ID in URL");
      return;
    }

    const scanQRCode = async () => {
      const devices = await Html5Qrcode.getCameras();
      if (devices && devices.length) {
        const frontCam = devices.find(device =>
          device.label.toLowerCase().includes('front')
        ) || devices[0];

        const html5QrCode = new Html5Qrcode("qr-reader");
        qrScannerRef.current = html5QrCode;

        html5QrCode.start(
          frontCam.id,
          { fps: 10, qrbox: { width: 250, height: 250 } },
          async (decodedText) => {
            if (!scanned) {
              setScanned(true);

              try {
                const parsed = JSON.parse(decodedText);
                const qrToken = parsed.qrToken;

                if (!qrToken) {
                  setMessage("❌ Invalid QR Code content.");
                  return;
                }

                const res = await fetch('http://localhost:5000/api/attendance/mark', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ qrToken, sessionId }),
                });

                const result = await res.json();
                setMessage(result.message || '✅ Attendance marked');
              } catch (error) {
                console.error('QR Scan Error or API Error:', error);
                setMessage('❌ Invalid QR code or server error.');
              }

              setTimeout(() => setScanned(false), 3000);
            }
          },
          (errorMessage) => {
            console.warn('QR scan error:', errorMessage);
          }
        ).catch((err) => {
          console.error('Failed to start QR scanner', err);
          setMessage('❌ Failed to start scanner.');
        });
      } else {
        setMessage("❌ No camera found.");
      }
    };

    scanQRCode();

    return () => {
      if (qrScannerRef.current) {
        qrScannerRef.current.stop().then(() => {
          qrScannerRef.current.clear();
          console.log('Scanner stopped.');
        }).catch((err) => {
          console.warn('Scanner stop error:', err);
        });
      }
    };
  }, [scanned, sessionId]);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Mark Attendance</h2>
      <p>Align the QR code in the box to scan.</p>
      <div id="qr-reader" style={{ width: '300px' }}></div>
      {message && <p><strong>{message}</strong></p>}
    </div>
  );
};

export default MarkAttendance;
