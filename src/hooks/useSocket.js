import { useEffect, useState, useRef } from "react";
import { connectSocket, disconnectSocket, getSocket } from "@/services/socket";

/**
 * useSocket — manages the Socket.IO lifecycle.
 *
 * Connects on mount, disconnects on unmount.
 * Returns the socket instance and a reactive `isConnected` flag
 * so components can gate UI (e.g. disable send button).
 */
export default function useSocket() {
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    const socket = connectSocket();
    socketRef.current = socket;

    // --- connection state listeners ---
    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    // If the socket was already connected before this effect ran
    if (socket.connected) {
      setIsConnected(true);
    }

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      disconnectSocket();
    };
  }, []);

  return { socket: socketRef.current ?? getSocket(), isConnected };
}
