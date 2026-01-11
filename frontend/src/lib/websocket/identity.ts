import { authStore } from "@/stores/auth-store";
import { socketService } from "./socket";

export const resolveIdentity = () => {
  const authState = authStore.getState();
  
  console.log("identity", authState.username);
  socketService.send({
    "type" : "set_username",
    "data" : {
        "username" : authState.username
    }
  });
  
};
