const API_BASE = import.meta.env.VITE_API_BASE || `http://${window.location.hostname}:5001/api`;

export async function fetchJSON(path, { method = 'GET', body = null, token = null } = {}) {
    const headers = { 'Accept': 'application/json' };
    if (body && !(body instanceof FormData)) headers['Content-Type'] = 'application/json';
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE}${path}`, {
        method,
        headers,
        body: body && !(body instanceof FormData) ? JSON.stringify(body) : body
    });

    const text = await res.text();
    if (!res.ok) throw new Error(text || `HTTP ${res.status}`);
    return text ? JSON.parse(text) : null;
}
