// my-project/src/config/config.js
export const config = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3003/api',
  appTitle: import.meta.env.VITE_APP_TITLE || 'TP VITE'
}