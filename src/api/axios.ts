
// This file defines a customized Axios instance used to make HTTP requests
// It automatically sets the base URL, default headers, and attaches the selected language to each request

// Importing Axios to create the HTTP client instance
import axios from 'axios';

// Importing the i18n instance to access the current selected language
import i18n from '../i18n';  

// Creating an Axios instance with default configuration
const instance = axios.create({
  baseURL: 'http://localhost:3000',  // Base URL for all requests made through this instance
  headers: {
    'Content-Type': 'application/json' // Default content type for requests
  }
});

// Adding an interceptor to modify each outgoing request before it's sent
instance.interceptors.request.use((config) => {
  // Attaching the current selected language to the request headers
  config.headers['Accept-Language'] = i18n.language || 'en'; // Default to English if no language is set
  return config;
});

// Exporting the Axios instance for use in the application
export default instance;
