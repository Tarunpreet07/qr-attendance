import { jwtDecode } from 'jwt-decode';

export const getUser = () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return null;
    return jwtDecode(token);
  } catch (err) {
    console.error("Failed to decode token", err);
    return null;
  }
};
