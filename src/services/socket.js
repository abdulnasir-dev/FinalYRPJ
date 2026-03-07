import { io } from "socket.io-client";

/**
 * Socket.IO client singleton.
 *
 * - autoConnect is OFF so the connection is only established when
 *   the useSocket hook explicitly calls connectSocket().
 * - The JWT token is read from localStorage at connect-time, ensuring
 *   the latest token is always sent.
 */

const SOCKET_URL = import.meta.env.VITE_API_BASE_URL;

let socket = null;

/**
 * Returns the existing socket instance or creates one.
 * Does NOT auto-connect — call connectSocket() to start the connection.
 */
export function getSocket() {
  if (!socket) {
    socket = io(SOCKET_URL, {
      autoConnect: false,
      auth: {
        token: localStorage.getItem("accessToken"),
      },
    });
  }
  return socket;
}

/**
 * Opens the socket connection.
 * Re-reads the token so reconnections after a token refresh work correctly.
 */
export function connectSocket() {
  const s = getSocket();
  // Refresh the auth token before every connect attempt
  s.auth = { token: localStorage.getItem("accessToken") };
  if (!s.connected) {
    s.connect();
  }
  return s;
}

/**
 * Disconnects the socket gracefully.
 */
export function disconnectSocket() {
  if (socket && socket.connected) {
    socket.disconnect();
  }
}
