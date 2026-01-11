import Link from "next/link";
import ControlCenter from "./ControlCenter";
import ConnectionStatus from "./ConnectionStatus";

export default function Navbar() {

  return (
    <header className="relative z-20 w-full border-b border-border-dark bg-bg-dark/60 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-[1600px] items-center justify-between px-6">
        {/* Brand */}
        <Link href="/" className="relative inline-block">
          <span className="absolute left-0 top-0 -z-10 translate-x-[2px] translate-y-[2px] text-accent/30 text-3xl font-serif font-bold select-none animate-[echoFade_0.6s_ease-out]">
            Echo
          </span>
          <span className="text-3xl font-serif font-bold text-text-main">
            Echo
          </span>
        </Link>

        <ControlCenter />

        <ConnectionStatus />
      </div>
    </header>
  );
}

