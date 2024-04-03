import { io } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
const URL = process.env.NODE_ENV === 'production' ? "https://ce232-backend.onrender.com" : 'http://localhost:3000';

export const socket = io(URL, {
    withCredentials : true,
});