"use client";

import { activeConnectionStore } from "@/stores/activeConnection-store";
import ChatHeader from "../chat/ChatHeader";
import ChatBox from "../chat/ChatBox";
import { messageStateStore } from "@/stores/message-store";

export default function ActiveConnectionChat() {
  const isActive = activeConnectionStore((s) => s.isActive);
  const activeConnectionId = activeConnectionStore((s) => s.activeConnectionId);
  const frndName = activeConnectionStore((s) => s.frndName);
  const clearActiveConnection = activeConnectionStore(
    (s) => s.clearActiveConnection
  );
  const savedMessages = messageStateStore((s) => s.saved);
  const setSaved = messageStateStore((s) => s.setSaved);

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
