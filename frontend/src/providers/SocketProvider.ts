"use client";

import { registerSocketEvents } from "@/lib/websocket/events";
import { socketService } from "@/lib/websocket/socket";
import { useEffect } from "react";
import { authStore } from "@/stores/auth-store";

export default function SocketProvider() {
  useEffect(() => {
    socketService.connect();
    registerSocketEvents();

    return () => {
      socketService.disconnect();
    };
  }, []);

  // Keep backend identity in sync with username changes
  useEffect(() => {
    const sendUsername = (username: string) => {
      if (!username) return;
      socketService.send({
        type: "set_username",
        data: { username },
      } as any);
    };

    // Send initial value if available
    sendUsername(authStore.getState().username);

    // Subscribe to future updates
    const unsubscribe = authStore.subscribe((state) => {
      sendUsername(state.username);
    });

    return () => unsubscribe();
  }, []);

  return null;
}
