"use client";

import { activeConnectionStore } from "@/stores/activeConnection-store";
import clsx from "clsx";
import StatusIndicator from "./StatusIndicator";

interface ChatHeaderProps {
  name: string | undefined;
  onBack?: () => void;
}

export default function ChatHeader({ name, onBack }: ChatHeaderProps) {
  if (!name) return null;

  const status = activeConnectionStore((s) => s.status);
  const isOnline = status === "online";

  return (
    <div
      className={clsx(
        "px-6 py-4 flex items-center gap-3 border-b",
        isOnline
          ? "border-emerald-500/30"
          : "border-red-500/20"
      )}
    >
      {onBack && (
        <button
          onClick={onBack}
          className="text-xs rounded-md border border-white/10 px-2 py-1 text-text-muted hover:text-echo hover:border-echo/40 transition"
        >
          Back
        </button>
      )}

      <span className="text-sm text-text-main/60">
        Talking with{" "}
        <span className="text-text-main font-medium">{name}</span>
      </span>

      {/* Status */}
      <StatusIndicator />
    </div>
  );
}
