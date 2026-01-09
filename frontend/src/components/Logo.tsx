export default function Logo() {
  return (
    <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 shadow-[0_0_28px_rgba(42,252,212,0.14)] backdrop-blur">
      <div className="relative h-10 w-10 flex items-center justify-center">
        <span
          className="absolute inset-1 rounded-full border border-echo/35"
          aria-hidden="true"
        />
        <span
          className="absolute inset-2 rounded-full border border-white/15"
          aria-hidden="true"
        />
        <span
          className="absolute inset-0 rounded-full bg-echo/18 blur-md"
          aria-hidden="true"
        />
        <span className="relative h-[6px] w-6 rounded-full bg-echo" />
      </div>

      <div className="leading-tight">
        <div className="text-xl font-semibold tracking-[0.14em] text-text-primary uppercase">
          <span className="text-echo">E</span>CHO
          <span className="ml-2 inline-block h-[2px] w-6 align-middle bg-echo" />
        </div>
        <div className="text-[10px] uppercase tracking-[0.28em] text-text-muted">
          conversations that return
        </div>
      </div>
    </div>
  );
}
