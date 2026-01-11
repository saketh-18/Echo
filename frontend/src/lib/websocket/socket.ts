"use client";

import { AnyMessage } from "@/types/chat";

class  WebSocketService {
    private socket: WebSocket | null = null
    public connected : boolean = false;
    
    connect(){
        if(this.socket) return ;
        
        const token = localStorage.getItem("token") ?? "";
        this.socket = new WebSocket(
            `${process.env.NEXT_PUBLIC_WS_URL}?token=${token.toString()}`
        )

        this.socket.onopen = () => {
            console.log("WebSocket Connected");
        }

        this.socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            window.dispatchEvent(
                new CustomEvent("ws-message", {detail : data})
            )
        }

        this.socket.onclose = () => {
            console.log("Websocket Closed")
            this.socket = null
        }
    }

    send(data : AnyMessage) {
        if(this.socket?.readyState == WebSocket.OPEN){
            this.socket.send(JSON.stringify(data))
        }
    }

    skip() {
        if(this.socket?.readyState == WebSocket.OPEN){
            const msg = {
                "type" : "system",
                "data" : {
                    "action" : "skip"
                }
            }
            this.socket.send(JSON.stringify(msg))
        }
    }

    disconnect() {
        this.socket?.close();
        this.socket = null;
    }
}

export const socketService = new WebSocketService();