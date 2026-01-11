"use client";

import { activeConnectionStore } from "@/stores/activeConnection-store";

export default function ConnectionRow({
  conn,
}: {
  conn: { connection_id: string; username: string };
}) {
  const setActiveConnection = activeConnectionStore(
    (state) => state.setActiveConnection
  );
  const setFrndName = activeConnectionStore((state) => state.setFrndName);

  function handleConnection(id: string, name: string) {
    setFrndName(name);
    setActiveConnection(id);
  }

  return (
    <li>
      <button
        className="
          group
          w-full
          flex items-center justify-between
          rounded-lg
          px-4 py-3
          text-left
          transition
          hover:bg-white/[0.04]
        "
      >
        {/* Left */}
        <div
          onClick={() => handleConnection(conn.connection_id, conn.username)}
          className="flex items-center gap-3"
        >
          {/* presence / memory dot */}
          <span className="h-1.5 w-1.5 rounded-full bg-white/30 group-hover:bg-echo transition" />

          <span className="text-sm text-text-main">{conn.username}</span>
        </div>
      </button>
    </li>
  );
}
