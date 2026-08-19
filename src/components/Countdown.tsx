import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type Parts = { d: number; h: number; m: number; s: number; over: boolean };

function diff(target: string): Parts {
  const ms = Math.max(0, new Date(target).getTime() - Date.now());
  return {
    d: Math.floor(ms / 86400000),
    h: Math.floor((ms / 3600000) % 24),
    m: Math.floor((ms / 60000) % 60),
    s: Math.floor((ms / 1000) % 60),
    over: ms === 0,
  };
}

/** Ticking clock that only runs after hydration, so SSR and client agree. */
function useTick(endsAt: string): Parts | null {
  const [t, setT] = useState<Parts | null>(null);
  useEffect(() => {
    setT(diff(endsAt));
    const id = setInterval(() => setT(diff(endsAt)), 1000);
    return () => clearInterval(id);
  }, [endsAt]);
  return t;
}

/** Flip/roll digit — remounts on value change so it animates in. */
function Cell({ value, label, size }: { value: string; label: string; size: "sm" | "lg" }) {
  return (
    <div className="flex flex-col items-center">
      <div
        className={cn(
          "overflow-hidden rounded-sm bg-ink px-2 py-1 font-display tabular-nums text-ink-foreground",
          size === "lg" ? "min-w-14 text-2xl sm:min-w-16 sm:text-3xl" : "min-w-9 text-sm",
        )}
      >
        <span key={value} className="block animate-flip">
          {value}
        </span>
      </div>
      <span
        className={cn(
          "label-caps mt-1 opacity-70",
          size === "lg" ? "text-[0.625rem]" : "text-[0.5rem]",
        )}
      >
        {label}
      </span>
    </div>
  );
}

export function Countdown({
  endsAt,
  size = "sm",
  className,
}: {
  endsAt: string;
  size?: "sm" | "lg";
  className?: string;
}) {
  const t = useTick(endsAt);
  const pad = (n: number | null) => (n === null ? "--" : String(n).padStart(2, "0"));

  if (t?.over) return <span className="label-caps">Sale ended</span>;

  return (
    <div className={cn("flex items-start gap-1.5", className)}>
      <Cell value={pad(t?.d ?? null)} label="Days" size={size} />
      <Cell value={pad(t?.h ?? null)} label="Hrs" size={size} />
      <Cell value={pad(t?.m ?? null)} label="Min" size={size} />
      <Cell value={pad(t?.s ?? null)} label="Sec" size={size} />
    </div>
  );
}

/** Compact inline HH:MM:SS for the announcement bar. */
export function InlineCountdown({ endsAt }: { endsAt: string }) {
  const t = useTick(endsAt);
  if (t?.over) return <span>Sale ended</span>;
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    <span className="tabular-nums">
      {t ? `${t.d}d ${pad(t.h)}:${pad(t.m)}:${pad(t.s)}` : "--d --:--:--"}
    </span>
  );
}
