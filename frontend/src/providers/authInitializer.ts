"use client";

import { useEffect } from "react";
import { authStore } from "@/stores/auth-store";
import { generateUsername } from "unique-username-generator";

function safeGenerateUsername() {
  try {
    return generateUsername("", 2, 15);
  } catch {
    return `anon-${Math.random().toString(36).slice(2, 8)}`;
  }
}

export default function AuthInitializer() {
  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const token = localStorage.getItem("token");
    const storedIsLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    if (storedUsername) {
      authStore.getState().setUsername(storedUsername);
    } else {
      const newName = safeGenerateUsername();
      authStore.getState().setUsername(newName);
      localStorage.setItem("username", newName);
    }

    // Use token presence as source of truth for login state
    const isLoggedIn = Boolean(token);
    authStore.getState().setIsLoggedIn(isLoggedIn);

    // Persist the login state to localStorage
    localStorage.setItem("isLoggedIn", isLoggedIn ? "true" : "false");
  }, []);

  return null;
}
