"use client";

import { activeConnectionStore } from "@/stores/activeConnection-store";
import { connectionStore } from "@/stores/connections-store";


export default function Connections() {
  const connections = connectionStore((s) => s.connections);
  
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-6 py-4">
        <p className="text-xs uppercase tracking-[0.2em] text-text-muted">
          Connections
        </p>
        <p className="mt-1 text-sm text-text-main/80">
          People you crossed paths with
        </p>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto hide-scrollbar px-4 pb-4">
        {connections.length === 0 ? (
          <EmptyState />
        ) : (
          <ul className="space-y-1">
            {connections.map((conn) => (
              <ConnectionRow key={conn.connection_id} conn={conn} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function ConnectionRow({
  conn,
}: {
  conn: { connection_id: string; username: string };
}) {
  const setActiveConnection = activeConnectionStore((state) => state.setActiveConnection);
  function handleConnection(id : string){
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
        <div onClick={() => handleConnection(conn.connection_id)}  className="flex items-center gap-3">
          {/* presence / memory dot */}
          <span className="h-1.5 w-1.5 rounded-full bg-white/30 group-hover:bg-echo transition" />

          <span className="text-sm text-text-main">
            {conn.username}
          </span>
        </div>

        {/* Right (quiet affordance) */}
        <span className="text-[11px] text-text-muted opacity-0 group-hover:opacity-100 transition">
          view
        </span>
      </button>
    </li>
  );
}

function EmptyState() {
  return (
    <div className="flex h-full items-center justify-center px-8">
      <p className="text-center text-sm text-text-muted/60 leading-relaxed">
        No connections yet.
        <br />
        Conversations leave traces here.
      </p>
    </div>
  );
}
