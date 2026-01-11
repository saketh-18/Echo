import { AnyMessage } from "@/types/chat";
import { socketService } from "./socket";

export const sendWsMessage = (data : AnyMessage) => {
    socketService.send(data);
}

export const skipChat = () => {
    socketService.skip();
}

export const sendSaveRequest = () => {
    const msg = {
        "type" : "system",
        "data" : {
            "action" : "save_request"
        }
    }
    socketService.send(msg);
}

export const sendSaveAccept = () => {
    const msg = {
        "type" : "system",
        "data" : {
            "action" : "save_accept"
        }
    }
    socketService.send(msg);
}