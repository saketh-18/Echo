"use client";

import { sendWsMessage } from "@/lib/websocket/actions";
import { uiStateStore } from "@/stores/uiState-store";
import { AnyMessage } from "@/types/chat";
import { FormEvent } from "react";

export default function ChatForm() {
  const setUiState = uiStateStore((state) => state.setUiState);
  // const [interests, setInterests] = useState("");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const msg = {
      type: "random",
    };
    sendWsMessage(msg);
    setUiState("searching");
  }

  return (
    <main className="relative w-full h-full font-display overflow-hidden flex flex-col justify-center items-end">
      {/* Subtle grid — background texture */}
      <div className="absolute inset-0 bg-grid opacity-50" />

      {/* Content */}
      <section className="relative z-10 mx-auto flex max-w-4xl items-center px-8">
        <div className="w-full max-w-md space-y-8">
          {/* Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Interests */}
            <div className="space-y-1">
              {/* <input
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                placeholder="Interests (music, late nights, startups)"
                className="
                  w-full
                  rounded-md
                  bg-surface
                  px-4
                  py-3
                  text-text-main
                  placeholder:text-text-main/40
                  focus:outline-none
                  focus:ring-1
                  focus:ring-accent/30
                  border
                  border-border-dark
                "
              /> */}

              <p className="text-xs text-text-main/40">
                Optional · Separate with commas
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="
                inline-flex
                items-center
                gap-2
                rounded-md
                bg-accent
                px-6
                py-3
                font-medium
                text-bg-dark
                transition
                hover:opacity-90
              "
            >
              Continue
            </button>
          </form>

          {/* Helper */}
          <p className="text-xs text-text-main/40">
            You can change this later. Saved chats require login.
          </p>
        </div>
      </section>
    </main>
  );
}
