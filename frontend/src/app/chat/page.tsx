"use client";

import ChatBox from "@/components/ChatBox";
import ChatForm from "@/components/ChatForm";
import Connections from "@/components/Connections";
import LoadingScreen from "@/components/LoadingScreen";
import Navbar from "@/components/Navbar";
import PartnerFound from "@/components/PartnerFound";
import PartnerSkipped from "@/components/PartnerSkipped";
import ChatHeader from "@/components/ChatHeader";
import { useWebSocket } from "@/hooks/useWebsocket";
import { activeConnectionStore } from "@/stores/activeConnection-store";
import { connectionStore } from "@/stores/connections-store";
import { LoginStore } from "@/stores/login-store";
import { messageStateStore } from "@/stores/message-store";
import { pairedToStore } from "@/stores/pairedTo-store";
import { uiStateStore } from "@/stores/uiState-store";
import { usernameStore } from "@/stores/username-store";
import { AnyMessage } from "@/types/chat";
import React, { useCallback, useEffect, useState } from "react";

export default function page() {
  const [activeTab, setActiveTab] = useState<"global" | "friends">("global");
  const [token, setToken] = useState("");
  const uiState = uiStateStore((state) => state.uiState);
  const messageState = messageStateStore();
  const pairedTo = pairedToStore((state) => state.pairedTo);
  const isLoggedIn = LoginStore((state) => state.isLoggedIn);
  const setIsLoggedIn = LoginStore((state) => state.setIsLoggedIn);
  const setConnections = connectionStore((state) => state.setConnections);
  const activeConnection = activeConnectionStore((state) => state);

  const onMessage = useCallback((msg: AnyMessage) => {
    if (msg.type == "chat" && "context" in msg) {
      if (msg.context == "random") messageState.setRandom(msg);
      if (msg.context == "global") messageState.setGlobal(msg);
      if (msg.context == "saved" && "connection_id" in msg.data) {
        messageState.setSaved(msg, msg.data.connection_id);
      }
    }
  }, []);

  const username = usernameStore((state) => state.username);
  const wsBase = process.env.NEXT_PUBLIC_WS_URL ?? "";
  const apiBase = process.env.NEXT_PUBLIC_API_URL;

  // Load token from localStorage on client mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token") ?? "";
    setToken(storedToken);
  }, []);

  const params = new URLSearchParams();
  params.set("token", token);
  params.set("username", username);
  const { send, connected, skip } = useWebSocket({
    url: `${wsBase}?${params.toString()}`,
    onMessage,
  });

  useEffect(() => {
    async function getConn() {
      if (!token) return;
      const res = await fetch(`${apiBase}/connections`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();

      if (res.ok) {
        setConnections(data);
      }
    }
    getConn();
  }, [isLoggedIn, token, apiBase, setConnections]);

  // Restore login state from token on page load
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !isLoggedIn) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <>
      <Navbar />

      <main className="relative h-[calc(100vh-64px)] bg-bg overflow-hidden">
        {/* Ambient background layers */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(42,252,212,0.06),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(120,140,150,0.04),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_70%,rgba(120,140,150,0.09),transparent_80%)]" />
        </div>

        <div className="relative mx-auto flex h-full max-w-[1600px] gap-0">
          {/* Left panel */}
          <aside className="flex w-[420px] flex-col border-r border-white/[0.06] bg-gradient-to-b from-white/[0.02] to-transparent">
            {/* Tabs */}
            <div className="px-4 pt-3">
              <div className="relative flex h-[44px] rounded-xl bg-white/[0.04] p-1">
                {/* Active indicator */}
                <div
                  className={`
        absolute top-1 bottom-1 w-[50%] rounded-lg
        bg-white/[0.06] backdrop-blur
        transition-all duration-300 ease-out
        ${activeTab === "global" ? "left-1" : "left-[50%]"}
      `}
                />

                <button
                  className={`
        relative z-10 flex-1 rounded-lg text-[13px] font-medium
        transition-colors
        ${
          activeTab === "global"
            ? "text-echo"
            : "text-text-muted hover:text-text-primary"
        }
      `}
                  onClick={() => setActiveTab("global")}
                >
                  Global
                </button>

                <button
                  className={`
        relative z-10 flex-1 rounded-lg text-[13px] font-medium
        transition-colors
        ${
          activeTab === "friends"
            ? "text-echo"
            : "text-text-muted hover:text-text-primary"
        }
      `}
                  onClick={() => setActiveTab("friends")}
                >
                  Friends
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden pt-4">
              {activeTab === "global" && (
                <div className="h-full">
                  <ChatHeader name={pairedTo} />
                  <ChatBox
                    username={username}
                    messages={messageState.global}
                    context="global"
                    send={send}
                    setMessages={messageState.setGlobal}
                  />
                </div>
              )}

              {activeTab === "friends" && (
                <div className="flex h-full flex-col px-6">
                  {isLoggedIn && !activeConnection.isActive && <Connections />}
                  {activeConnection.isActive &&
                    activeConnection.activeConnectionId.length > 0 &&
                    (() => {
                      const connections =
                        connectionStore.getState().connections;
                      const friendName = connections.find(
                        (c) =>
                          c.connection_id ===
                          activeConnection.activeConnectionId
                      )?.username;
                      return (
                        <>
                          <ChatHeader
                            name={friendName}
                            onBack={() =>
                              activeConnection.clearActiveConnection()
                            }
                          />
                          <div className="flex-1">
                            <ChatBox
                              context="saved"
                              username={username}
                              send={send}
                              messages={
                                messageState.saved[
                                  activeConnection.activeConnectionId
                                ] ?? []
                              }
                              connectionId={activeConnection.activeConnectionId}
                              setMessages={(msg) => {
                                if (Array.isArray(msg)) {
                                  msg.forEach((m) =>
                                    messageState.setSaved(
                                      m,
                                      activeConnection.activeConnectionId
                                    )
                                  );
                                } else {
                                  messageState.setSaved(
                                    msg,
                                    activeConnection.activeConnectionId
                                  );
                                }
                              }}
                            />
                          </div>
                        </>
                      );
                    })()}
                </div>
              )}
            </div>
          </aside>

          {/* Right panel — Random */}
          <section className="relative flex flex-1 flex-col">
            {/* Header bar */}
            <div className="flex items-center justify-between border-b border-white/[0.06] px-8 h-[60px]">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-echo/40 animate-pulse" />
                  <span className="text-xs uppercase font-medium tracking-[0.15em] text-white p-1 rounded-md bg-accent/20">
                    Random {connected && <span>Connected </span>}
                  </span>
                </div>
                <span className="text-[13px] text-text-primary/40">
                  Quiet conversation with a stranger
                </span>
              </div>

              {uiState == "chatting" && (
                <button
                  onClick={skip}
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
              )}
            </div>

            {/* Chat area */}
            <div className="flex-1 overflow-hidden">
              {uiState == "chatting" && (
                <ChatBox
                  username={username}
                  messages={messageState.random}
                  context="random"
                  pairedTo={pairedTo}
                  send={send}
                  setMessages={messageState.setRandom}
                />
              )}
              {uiState == "form" && <ChatForm send={send} />}
              {uiState == "found" && <PartnerFound />}
              {uiState == "got_skipped" && <PartnerSkipped send={send} />}
              {uiState == "searching" && <LoadingScreen />}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
