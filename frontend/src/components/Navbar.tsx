"use client";

import { LoginStore } from "@/stores/login-store";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usernameStore } from "@/stores/username-store";

/**
 * Minimal Navbar
 * Blends with ambient background
 * Shows identity + connection context
 */

export default function Navbar() {
  const isLoggedIn = LoginStore((state) => state.isLoggedIn);
  const setIsLoggedIn = LoginStore((state) => state.setIsLoggedIn);
  const username = usernameStore((state) => state.username);
  const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "";
  const router = useRouter();
  
  async function logout() {
    const access_token = localStorage.getItem("token");
    const res = await fetch(`${apiBase}/auth/logout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    if (res.status == 204) {
      console.log("logged out successfully");
      setIsLoggedIn(false);
      localStorage.clear();
      router.push("/login");
    }
  }

  return (
    <header
      className="
        relative
        z-20
        w-full
        border-b
        border-border-dark
        bg-bg-dark/60
        backdrop-blur-md
      "
    >
      <div className="mx-auto flex h-14 max-w-[1600px] items-center justify-between px-6">
        {/* Brand */}
        <Link href={"/"} className="relative inline-block">
          {/* Soft echo layer */}
          <span
            className="
      absolute
    left-0
    top-0
    -z-10
    translate-x-[2px]
    translate-y-[2px]
    text-accent/30
    text-3xl
    font-serif
    font-bold
    select-none
    animate-[echoFade_0.6s_ease-out]
    "
          >
            Echo
          </span>

          {/* Main brand */}
          <span className="text-3xl font-serif font-bold text-text-main">
            Echo
          </span>
        </Link>

        <div className="flex gap-4 items-center">
          {!isLoggedIn ? (
            <div className="flex gap-4 items-center">
              <Link
                className="text-sm text-text-main/70 hover:text-accent transition-colors"
                href={"/login"}
              >
                Login
              </Link>
              <Link
                className="px-4 py-1.5 text-sm rounded-lg bg-accent/10 text-accent hover:bg-accent/20 transition-colors border border-accent/20"
                href={"/register"}
              >
                Register
              </Link>
            </div>
          ) : (
            <button
              onClick={logout}
              className="px-4 py-1.5 text-sm rounded-lg bg-white/5 text-text-main/70 hover:bg-white/10 hover:text-text-main transition-colors border border-white/10"
            >
              Logout
            </button>
          )}
        </div>

        {/* Connection status */}
        <ConnectionStatus username={username} />
      </div>
    </header>
  );
}

function ConnectionStatus({ username }: { username: string }) {
  return (
    <div className="text-sm text-text-main/60">
      Connected as{" "}
      <span className="text-text-main">{username || "anonymous"}</span>
    </div>
  );
}
