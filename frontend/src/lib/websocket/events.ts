import { connectionStore } from "./../../stores/connections-store";
import { messageStateStore } from "@/stores/message-store";
import { pairedToStore } from "@/stores/pairedTo-store";
import { uiStateStore } from "@/stores/uiState-store";
import { resolveIdentity } from "./identity";
import { authStore } from "@/stores/auth-store";
import { sendSaveAccept } from "./actions";
import Swal from "sweetalert2";
import { connectionsRepo } from "@/repositories/connections.repo";

type WSEvent = CustomEvent<any>;

export const registerSocketEvents = () => {
  // Use the store APIs directly to avoid invoking React hooks outside components
  const messageState = messageStateStore.getState();
  const pairedToState = pairedToStore.getState();
  const uiState = uiStateStore.getState();
  const loginState = authStore.getState();

  const handleMessage = async (event: Event) => {
    const { detail } = event as WSEvent;
    const data = detail;
    console.log("event", data);
    if (data.type === "connected") {
      messageState.setRandom([]);
      pairedToState.setPairedTo(data.paired_to);
      uiState.setUiState("found");
      setTimeout(() => {
        uiState.setUiState("chatting");
      }, 900);
    } else if (data.type === "skip") {
      pairedToState.setPairedTo("");
      uiState.setUiState("got_skipped");
    } else if (data.type === "auth-confirm") {
      const storage =
        typeof window === "undefined" ? null : window.localStorage;

      if (data.isLoggedIn === "true") {
        const storedUsername = storage?.getItem("username") ?? "";
        const storedToken = storage?.getItem("token") ?? null;

        if (storedUsername) loginState.setUsername(storedUsername);

        const isLoggedIn = Boolean(storedToken);
        loginState.setIsLoggedIn(isLoggedIn);
        storage?.setItem("isLoggedIn", isLoggedIn ? "true" : "false");
        const fetchedConnections = await connectionsRepo.getConnections();
        connectionStore.getState().setConnections(fetchedConnections.data);
      } else {
        loginState.setIsLoggedIn(false);
        storage?.setItem("isLoggedIn", "false");
      }

      resolveIdentity();
    } else if (data.context === "random") {
      messageState.setRandom(data);
    } else if (data.context === "global") {
      messageState.setGlobal(data);
    } else if (data.context === "saved") {
      const connection_id = data.data.connection_id;
      messageState.setSaved(data, connection_id);
    } else if (data.type === "system" && data.data?.action === "save_request") {
      Swal.fire({
        title: "Save this conversation?",
        text: "Would you like to save this chat to your collection?",
        icon: "question",
        confirmButtonText: "Save",
        cancelButtonText: "Discard",
        background: "rgb(23, 23, 31)",
        color: "rgb(226, 232, 240)",
        confirmButtonColor: "rgb(42, 252, 212)",
        cancelButtonColor: "rgb(100, 116, 139)",
        showCancelButton: true,
        reverseButtons: true,
      }).then((result) => {
        if (result.isConfirmed) {
          sendSaveAccept();
        }
      });
    } else if (data.type === "online_status") {
      // Handle online/offline status updates
      const { username, is_online } = data.data;
      const connStore = connectionStore.getState();

      if (is_online) {
        connStore.setUserOnline(username);
      } else {
        connStore.setUserOffline(username);
      }
      console.log(`User ${username} is now ${is_online ? "online" : "offline"}`);
    } else if (data.type == "online_indicator") {
    }
  };

  window.addEventListener("ws-message", handleMessage);

  return () => window.removeEventListener("ws-message", handleMessage);
};
