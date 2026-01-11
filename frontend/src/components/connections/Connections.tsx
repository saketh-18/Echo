"use client";

import { activeConnectionStore } from "@/stores/activeConnection-store";
import { connectionStore } from "@/stores/connections-store";
import ConnectionRow from "./ConnectionRow";
import EmptyState from "./EmptyState";


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
        {connections && connections.length === 0 ? (
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
