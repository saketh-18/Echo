"use client";

import { activeConnectionStore } from "@/stores/activeConnection-store";
import ChatHeader from "../chat/ChatHeader";
import ChatBox from "../chat/ChatBox";
import { messageStateStore } from "@/stores/message-store";
import { useEffect } from "react";
import { apiClient } from "@/api/client";

export default function ActiveConnectionChat() {
  const isActive = activeConnectionStore((s) => s.isActive);
  const activeConnectionId = activeConnectionStore((s) => s.activeConnectionId);
  const frndName = activeConnectionStore((s) => s.frndName);
  const clearActiveConnection = activeConnectionStore(
    (s) => s.clearActiveConnection
  );
  const savedMessages = messageStateStore((s) => s.saved);
  const setSaved = messageStateStore((s) => s.setSaved);

  // Fetch messages when connection is selected
  useEffect(() => {
    if (!isActive || !activeConnectionId) return;

    const fetchMessages = async () => {
      const res = await apiClient(
        `messages?connection_id=${activeConnectionId}`
      );

      if (res.ok && res.data && Array.isArray(res.data)) {
        // Transform backend response to AnyMessage format
        const formattedMessages = res.data.map((msg: any) => ({
          type: "chat",
          context: "saved",
          data: {
            connection_id: msg.connection_id,
            message: msg.contents,
            sender: msg.sender_username,
            timestamp: msg.created_at,
          },
        }));

        // Pass entire array to setSaved
        setSaved(formattedMessages, activeConnectionId);
      }
    };

    fetchMessages();
  }, [activeConnectionId, isActive, setSaved]);

  if (!isActive || !activeConnectionId) {
    return null;
  }

  return (
    <>
      <ChatHeader name={frndName} onBack={() => clearActiveConnection()} />
      <ChatBox
        context="saved"
        connectionId={activeConnectionId}
        messages={savedMessages[activeConnectionId] || []}
        setSavedMessages={setSaved}
      />
    </>
  );
}
