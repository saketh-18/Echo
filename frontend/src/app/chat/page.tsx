"use client";

import ChatBox from "@/components/chat/ChatBox";
import ChatForm from "@/components/chat/ChatForm";
import Connections from "@/components/connections/Connections";
import LoadingScreen from "@/components/chat/LoadingScreen";
import Navbar from "@/components/Navbar";
import PartnerFound from "@/components/chat/PartnerFound";
import PartnerSkipped from "@/components/chat/PartnerSkipped";
import ChatHeader from "@/components/chat/ChatHeader";
import { activeConnectionStore } from "@/stores/activeConnection-store";
import { connectionStore } from "@/stores/connections-store";
import { messageStateStore } from "@/stores/message-store";
import { uiStateStore } from "@/stores/uiState-store";
import { useState } from "react";
import { authStore } from "@/stores/auth-store";
import ChatControl from "@/components/chat/ChatControl";
import ActiveConnectionChat from "@/components/connections/ActiveConnectionChat";

export default function page() {
  const [activeTab, setActiveTab] = useState<"global" | "friends">("global");
  const uiState = uiStateStore((state) => state.uiState);
  const messageState = messageStateStore();
  const isLoggedIn = authStore((state) => state.isLoggedIn);
  const activeConnection = activeConnectionStore((state) => state);

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
                  <ChatBox
                    messages={messageState.global}
                    context="global"
                    setMessages={messageState.setGlobal}
                  />
                </div>
              )}

              {activeTab === "friends" && (
                <div className="flex h-full flex-col px-6">
                  {isLoggedIn && !activeConnection.isActive && <Connections />}
                  {!isLoggedIn && (
                    <div className="flex items-center justify-center h-full">
                      <p className="p-2 rounded-md bg-accent/10">
                        Login to see your Saved Chats
                      </p>
                    </div>
                  )}
                  <ActiveConnectionChat />
                </div>
              )}
            </div>
          </aside>

          {/* Right panel — Random */}
          <section className="relative flex flex-1 flex-col">
            {/* Header bar */}
            <ChatControl />

            {/* Chat area */}
            <div className="flex-1 overflow-hidden">
              {uiState == "chatting" && (
                <ChatBox
                  messages={messageState.random}
                  context="random"
                  setMessages={messageState.setRandom}
                />
              )}
              {uiState == "form" && <ChatForm />}
              {uiState == "found" && <PartnerFound />}
              {uiState == "got_skipped" && <PartnerSkipped />}
              {uiState == "searching" && <LoadingScreen />}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
