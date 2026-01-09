"use client";


import { LoginStore } from "@/stores/login-store";
import { messageStateStore } from "@/stores/message-store";
import { pairedToStore } from "@/stores/pairedTo-store";
import { uiStateStore } from "@/stores/uiState-store";
import { AnyMessage, savedMessage, systemMessage, typingMessage, WSMessage } from "@/types/chat";
import { useEffect, useRef, useState, useCallback } from "react";

type Options = {
  url: string;
  onMessage?: (msg: WSMessage) => void;
};

export function useWebSocket({
  url,
  onMessage,
}: Options) {
  const setIsLoggedIn = LoginStore((state) => state.setIsLoggedIn);
  const setUiState = uiStateStore((state) => state.setUiState);
  const socketRef = useRef<WebSocket | null>(null);
  const setPairedTo = pairedToStore((state) => state.setPairedTo);
  const [connected, setConnected] = useState(false);
  const setRandom = messageStateStore((s) => s.setRandom);

  const connect = useCallback(() => {
    if (socketRef.current) return;

    const ws = new WebSocket(url);
    socketRef.current = ws;

    ws.onopen = () => {
      setConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log(data)
        if(data.type == "connected") {
          setPairedTo(data.paired_to);
          setUiState("found");
          setTimeout(() => {
            setUiState("chatting");
          }, 900);
        } else if(data.type == "skip") {
          setPairedTo("");
          setUiState("got_skipped");
        } else if(data.type == "auth-confirm") {
          if(data.isLoggedIn == "true") {
            setIsLoggedIn(true);
          }
        }
        else {
          onMessage?.(data); 
        }
      } catch {
        console.warn("Invalid WS message:", event.data);
      }
    };

    ws.onclose = () => {
      setConnected(false);
      socketRef.current = null;
    };

    ws.onerror = () => {
      ws.close();
    };
  }, [url, onMessage]);

  const disconnect = useCallback(() => {
    socketRef.current?.close();
    socketRef.current = null;
  }, []);

  const send = useCallback((payload: AnyMessage) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(payload));
    }
  }, []);

  const skip = useCallback(() => {
    setRandom([]);
    if(socketRef.current?.readyState === WebSocket.OPEN){
      socketRef.current.send(JSON.stringify({"type" : "system", 
        "data" : {
          "action" : "skip"
        }
      }));
    }
    setUiState("searching");
  }, []);

  useEffect(() => {
    connect();
    return disconnect;
  }, [connect, disconnect]);

  return {
    connected,
    send,
    disconnect,
    skip
  };
}
