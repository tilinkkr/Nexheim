// Automatically switch between Localhost and Production URL
const API_URL = import.meta.env.VITE_API_BASE || `http://${window.location.hostname}:5001/api`;

export default API_URL;
