import { sendWsMessage } from "@/lib/websocket/actions";
import { authStore } from "@/stores/auth-store";
import { AnyMessage } from "@/types/chat";
import { FormEvent, useLayoutEffect, useRef, useState } from "react";

type setMessageType = (
  arg: AnyMessage | AnyMessage[],
  connection_id?: string
) => void;

type setSavedMessageType = (arg: AnyMessage, connection_id: string) => void;

interface chatProps {
  context: string;
  connectionId?: string;
  messages: AnyMessage[];
  setMessages?: setMessageType;
  setSavedMessages?: setSavedMessageType;
}
/* 
  Displays Messages and sends messages
*/

export default function ChatBox({
  context,
  messages,
  setMessages,
  connectionId,
  setSavedMessages,
}: chatProps) {
  // For scrolling to bottom on new messages
  const messageRef = useRef<HTMLDivElement>(null);
  const [currentMsg, setCurrentMsg] = useState("");

  function scrollToBottom() {
    messageRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  // Use .getState() to avoid hook ordering issues - we only need current username, don't need to subscribe to changes
  const username = authStore.getState().username;
  const sendMessage = (
    e: FormEvent<HTMLFormElement>,
    text: string,
    context: string
  ) => {
    e.preventDefault();
    const base = {
      type: "chat" as const,
      context,
    };

    const msg: AnyMessage =
      context === "saved" && connectionId
        ? {
            ...base,
            data: {
              connection_id: connectionId,
              message: text,
              timestamp: new Date().toISOString(),
              sender: username,
            },
          }
        : {
            ...base,
            data: {
              message: text,
              timestamp: new Date().toISOString(),
              sender: username,
            },
          };

    setCurrentMsg("");
    if (context === "saved" && connectionId) {
      setSavedMessages?.(msg, connectionId);
    } else {
      setMessages?.(msg);
    }
    sendWsMessage(msg);
  };
  useLayoutEffect(() => {
    scrollToBottom();
    // console.log(messages);
  }, [messages]);

  return (
    <section className="relative flex h-full flex-col overflow-hidden">
      {/* subtle floor gradient */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40
               bg-gradient-to-t from-bg/80 to-transparent"
      />

      {/* Header removed — use ChatHeader component in parent */}

      {/* Message stream */}
      <div
        className="
      flex-1
      overflow-y-auto
      hide-scrollbar
      px-6
      pb-6
      space-y-6
    "
      >
        {messages.map((msg, index) => (
          <ChatBubble key={index} msg={msg} />
        ))}
        <div ref={messageRef} />
      </div>

      {/* Input dock — part of the room */}
      <form
        onSubmit={(e) => sendMessage(e, currentMsg, context)}
        className={`
      flex-shrink-0
      px-6 py-5
      z-20
      w-full
      ${context == "random" && "bg-bg-dark/80"}
    `}
      >
        <div
          className="
        mx-auto
        max-w-2xl
        flex items-center gap-4
        rounded-full
        bg-white/5
        backdrop-blur-xl
        border border-white/10
        px-5 py-3
      "
        >
          <input
            value={currentMsg}
            onChange={(e) => setCurrentMsg(e.target.value)}
            placeholder="Say something honest…"
            className="
          flex-1
          bg-transparent
          text-sm
          text-text-main
          placeholder:text-text-main/40
          focus:outline-none
        "
          />

          <button
            type="submit"
            className="
          text-sm
          font-medium
          text-echo
          hover:opacity-80
          transition
        "
          >
            Send
          </button>
        </div>
      </form>
    </section>
  );
}

/* ======================================================
   Chat Bubble
   ====================================================== */
function ChatBubble({ msg }: { msg: AnyMessage }) {
  // Use .getState() to avoid hook ordering issues - ChatBubble is rendered in a map, hooks must be consistent
  const username = authStore.getState().username;
  const isSystem = msg.type === "system";
  const isYou =
    "data" in msg && "sender" in msg.data && msg.data.sender === username;
  const senderLabel = isYou
    ? "You"
    : "data" in msg && "sender" in msg.data
    ? msg.data.sender
    : "";

  if (isSystem || !("data" in msg)) {
    return (
      <div className="flex justify-center">
        <span className="text-xs text-text-main/45 italic">
          {"data" in msg && "message" in msg.data ? msg.data.message : ""}
        </span>
      </div>
    );
  }

  return (
    <div className={isYou ? "flex justify-end" : "flex justify-start"}>
      <div
        className={`
      group
      max-w-[65%]
      space-y-1
      ${isYou ? "items-end text-right" : "items-start text-left"}
    `}
      >
        {senderLabel && (
          <span className="text-[11px] text-text-main/50">{senderLabel}</span>
        )}
        {/* Message surface */}
        <div
          className={`
        relative
        rounded-2xl
        px-4 py-2.5
        text-sm
        leading-relaxed
        backdrop-blur
        chat-message
        ${
          isYou
            ? "bg-echo/10 text-text-main"
            : "bg-white/[0.04] text-text-main/90"
        }
      `}
        >
          {"message" in msg.data ? msg.data.message : ""}
        </div>

        {/* Meta row */}
        {"timestamp" in msg.data && (
          <div
            className={`
          flex items-center gap-2
          text-[11px]
          text-text-main/35
          ${isYou ? "justify-end" : "justify-start"}
        `}
          >
            {/* sender dot */}
            <span
              className={`
            h-1 w-1 rounded-full
            ${isYou ? "bg-echo" : "bg-white/30"}
          `}
            />
            <span>{formatTime(msg.data.timestamp)}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function formatTime(iso: string) {
  const date = new Date(iso);
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}
