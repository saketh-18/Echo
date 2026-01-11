"use client";

import { authStore } from "@/stores/auth-store";

export default function ConnectionStatus() {
  const username = authStore((state) => state.username);

  return (
    <div className="text-sm text-text-main/60">
      Connected as{" "}
      <span className="text-text-main">{username || "anonymous"}</span>
    </div>
  );
}
