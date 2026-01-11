"use client";

import { authStore } from "@/stores/auth-store";
import { useEffect, useState } from "react";

export default function ConnectionStatus() {
  const [mounted, setMounted] = useState(false);
  const username = authStore((state) => state.username);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Show anonymous until hydrated
  if (!mounted) {
    return (
      <div className="text-sm text-text-main/60">
        Connected as <span className="text-text-main">anonymous</span>
      </div>
    );
  }

  return (
    <div className="text-sm text-text-main/60">
      Connected as{" "}
      <span className="text-text-main">{username || "anonymous"}</span>
    </div>
  );
}
