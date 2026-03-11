import { useEffect, useState, useRef } from "react";
import { connectSocket, disconnectSocket, getSocket } from "@/services/socket";

/**
 * useSocket — manages the Socket.IO lifecycle.
 *
 * Connects on mount, disconnects on unmount.
 * Returns the socket instance, a reactive `isConnected` flag,
 * and a `connectionError` string so the UI can show meaningful errors.
 */
export default function useSocket() {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {
    const socket = connectSocket();
    socketRef.current = socket;

    // --- connection state listeners ---
    const onConnect = () => {
      setIsConnected(true);
      setConnectionError(null);
    };
    const onDisconnect = () => setIsConnected(false);

    const onConnectError = (err) => {
      console.error("Socket connect_error:", err.message);
      setConnectionError(err.message || "Connection failed");
      setIsConnected(false);
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onConnectError);

    // If the socket was already connected before this effect ran
    if (socket.connected) {
      setIsConnected(true);
    }

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onConnectError);
      disconnectSocket();
    };
  }, []);

  return { socket: socketRef.current ?? getSocket(), isConnected, connectionError };
}
