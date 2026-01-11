"use client";

import { activeConnectionStore } from "@/stores/activeConnection-store";
import { connectionStore } from "@/stores/connections-store";
import StatusIndicator from "../chat/StatusIndicator";

export default function ConnectionRow({
  conn,
}: {
  conn: { connection_id: string; username: string };
}) {
  const setActiveConnection = activeConnectionStore(
    (state) => state.setActiveConnection
  );
  const setFrndName = activeConnectionStore((state) => state.setFrndName);
  const onlineUsers = connectionStore((state) => state.onlineUsers);
  const isOnline = onlineUsers.has(conn.username);

  function handleConnection(id: string, name: string) {
    setFrndName(name);
    setActiveConnection(id);
  }

  return (
    <button
      className=" group
    w-full
    flex items-center gap-3
    rounded-xl
    px-4 py-3
    transition
    hover:bg-white/[0.035]"
      onClick={() => handleConnection(conn.connection_id, conn.username)}
    >
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-sm font-medium text-text-main">
            {conn.username.charAt(0).toUpperCase()}
          </div>
          <p>{conn.username}</p>
        </div>
        <div className="flex items-center gap-5">
          <StatusIndicator isOnline={isOnline} />
          <span className="text-text-muted/40 group-hover:text-text-muted">
            ›
          </span>
        </div>
      </div>
    </button>
  );
}
