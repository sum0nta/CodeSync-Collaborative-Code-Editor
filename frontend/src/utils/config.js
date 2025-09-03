export const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5001';

export const getWSUrl = () => {
  if (process.env.REACT_APP_BACKEND_URL) {
    return process.env.REACT_APP_BACKEND_URL;
  }
  return 'http://localhost:5001';
};
