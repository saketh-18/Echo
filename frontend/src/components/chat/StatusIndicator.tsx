import clsx from "clsx";

export default function StatusIndicator({
  isOnline = false,
}: {
  isOnline?: boolean;
}) {
  return (
    <span
      className={clsx(
        "ml-2 flex items-center gap-2 rounded-full px-2.5 py-0.5 text-[11px] lowercase border",
        isOnline
          ? "border-emerald-500/40 text-emerald-400 bg-emerald-500/10"
          : "border-red-500/30 text-red-400 bg-red-500/10"
      )}
    >
      <span
        className={clsx(
          "h-1.5 w-1.5 rounded-full",
          isOnline ? "bg-emerald-400 animate-pulse" : "bg-red-400 opacity-70"
        )}
      />
      {isOnline ? "online" : "offline"}
    </span>
  );
}
