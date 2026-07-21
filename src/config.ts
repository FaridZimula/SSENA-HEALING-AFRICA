/**
 * Global Configuration for SUYEL Website
 */

// Detect environment
const isLocalhost = typeof window !== 'undefined' &&
    (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");

// Production API URL
// On localhost, we point to the local backend. On production, we use relative paths.
export const API_BASE_URL = isLocalhost ? "http://localhost:5000" : "";
export const API_URL = `${API_BASE_URL}/api`;

export default {
    API_URL,
    API_BASE_URL
};
