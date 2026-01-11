"use client";

import { sendSaveRequest, skipChat } from "@/lib/websocket/actions";
import { authStore } from "@/stores/auth-store";
import { uiStateStore } from "@/stores/uiState-store";
import React from "react";

export default function ChatControl() {
    const uiState = uiStateStore((s) => s.uiState);
    const setUiState = uiStateStore((s) => s.setUiState);
    const isLoggedIn = authStore((s) => s.isLoggedIn);
      function handleSkip() {
        setUiState("searching");
        skipChat();
      }

      function handleSave() {
        sendSaveRequest();
      }

  return (
    <div className="flex items-center justify-between border-b border-white/[0.06] px-8 h-[60px]">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-echo/40 animate-pulse" />
          <span className="text-xs uppercase font-medium tracking-[0.15em] text-white p-1 rounded-md bg-accent/20">
            {/* Random {connected && <span>Connected </span>} */}
          </span>
        </div>
        <span className="text-[13px] text-text-primary/40">
          Quiet conversation with a stranger
        </span>
      </div>

      {uiState == "chatting" && (
        <div className="flex">
          <button
            onClick={handleSkip}
            className="group flex items-center gap-2 rounded-full border border-white/[0.08] px-4 py-1.5 text-xs font-medium text-text-muted/70 transition hover:border-echo/30 hover:text-echo"
          >
            <span>Skip</span>
            <svg
              className="h-3 w-3 transition-transform group-hover:translate-x-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 5l7 7-7 7M5 5l7 7-7 7"
              />
            </svg>
          </button>
          {isLoggedIn && (
            <button onClick={handleSave}
             className="group flex items-center gap-2 rounded-full border border-white/[0.08] px-4 py-1.5 text-xs font-medium text-text-muted/70 transition hover:border-echo/30 hover:text-echo">
              <span>Save</span>
              <svg
                className="h-3 w-3 transition-transform group-hover:translate-x-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 5l7 7-7 7M5 5l7 7-7 7"
                />
              </svg>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
