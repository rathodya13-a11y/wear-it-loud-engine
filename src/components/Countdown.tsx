import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

function diff(target: string) {
  const ms = Math.max(0, new Date(target).getTime() - Date.now());
  return {
    d: Math.floor(ms / 86400000),
    h: Math.floor((ms / 3600000) % 24),
    m: Math.floor((ms / 60000) % 60),
    s: Math.floor((ms / 1000) % 60),
    over: ms === 0,
  };
}

/** Flip/roll digit — remounts on value change so it animates in. */
function Cell({ value, label, size }: { value: number; label: string; size: "sm" | "lg" }) {
  const text = String(value).padStart(2, "0");
  return (
    <div className="flex flex-col items-center">
      <div
        className={cn(
          "overflow-hidden rounded-sm bg-ink px-2 py-1 font-display tabular-nums text-ink-foreground",
          size === "lg" ? "min-w-14 text-2xl sm:min-w-16 sm:text-3xl" : "min-w-9 text-sm",
        )}
      >
        <span key={text} className="block animate-flip">
          {text}
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
  const [t, setT] = useState(() => diff(endsAt));

  useEffect(() => {
    const id = setInterval(() => setT(diff(endsAt)), 1000);
    return () => clearInterval(id);
  }, [endsAt]);

  if (t.over) return <span className="label-caps">Sale ended</span>;

  return (
    <div className={cn("flex items-start gap-1.5", className)}>
      <Cell value={t.d} label="Days" size={size} />
      <Cell value={t.h} label="Hrs" size={size} />
      <Cell value={t.m} label="Min" size={size} />
      <Cell value={t.s} label="Sec" size={size} />
    </div>
  );
}

/** Compact inline HH:MM:SS for the announcement bar. */
export function InlineCountdown({ endsAt }: { endsAt: string }) {
  const [t, setT] = useState(() => diff(endsAt));
  useEffect(() => {
    const id = setInterval(() => setT(diff(endsAt)), 1000);
    return () => clearInterval(id);
  }, [endsAt]);
  if (t.over) return <span>Sale ended</span>;
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    <span className="tabular-nums">
      {t.d}d {pad(t.h)}:{pad(t.m)}:{pad(t.s)}
    </span>
  );
}
