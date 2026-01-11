"use client";

interface ChatHeaderProps {
  name: string | undefined;
  onBack?: () => void;
}

export default function ChatHeader({ name, onBack }: ChatHeaderProps) {
  if (!name) return null;
  return (
    <div className="px-6 py-4 flex items-center gap-3">
      {onBack && (
        <button
          onClick={onBack}
          className="text-xs rounded-md border border-white/10 px-2 py-1 text-text-muted hover:text-echo hover:border-echo/40 transition"
        >
          Back
        </button>
      )}
      <span className="text-sm text-text-main/60">
        Talking with <span className="text-text-main font-medium">{name}</span>
      </span>
    </div>
  );
}
