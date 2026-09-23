/*This file defines an Axios instance for making HTTP requests to the backend API of the InterviewKit AI application. It sets the base URL for the API and configures the instance to include credentials (such as cookies) in cross-origin requests. The configured Axios instance is exported for use in other parts of the client application to facilitate communication with the server.*/

import axios from "axios";

const host =
  typeof window !== "undefined"
    ? window.location.hostname
    : "localhost";

const api = axios.create({
  baseURL: `http://${host}:5000/api`,
  withCredentials: true,
});

export default api;