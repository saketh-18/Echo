"use client";

import { apiClient } from "@/api/client";
import { authStore } from "@/stores/auth-store";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

export default function ControlCenter() {
  const router = useRouter();
  const isLoggedIn = authStore((s) => s.isLoggedIn);
  const setIsLoggedIn = authStore((s) => s.setIsLoggedIn);

  async function logout() {
    const res = await apiClient("auth/logout", {
      method: "POST",
    });
    if (res.status == 204) {
      setIsLoggedIn(false);
      localStorage.clear();
      router.push("/login");
    }
  }
  return (
    <div className="flex gap-4 items-center">
      {!isLoggedIn ? (
        <>
          <Link
            className="text-sm text-text-main/70 hover:text-accent transition-colors"
            href="/login"
          >
            Login
          </Link>
          <Link
            className="px-4 py-1.5 text-sm rounded-lg bg-accent/10 text-accent hover:bg-accent/20 transition-colors border border-accent/20"
            href="/register"
          >
            Register
          </Link>
        </>
      ) : (
        <button
          onClick={logout}
          className="px-4 py-1.5 text-sm rounded-lg bg-white/5 text-text-main/70 hover:bg-white/10 hover:text-text-main transition-colors border border-white/10"
        >
          Logout
        </button>
      )}
    </div>
  );
}
