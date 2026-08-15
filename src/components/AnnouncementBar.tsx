import { InlineCountdown } from "@/components/Countdown";
import { SALE_ENDS_AT } from "@/lib/products";

export function AnnouncementBar() {
  const items = [
    <>
      🔥 Flash sale — 40% off ends in <InlineCountdown endsAt={SALE_ENDS_AT} />
    </>,
    <>Free shipping over ₹999</>,
    <>New drop just landed</>,
  ];

  return (
    <div className="overflow-hidden bg-ink text-ink-foreground">
      <div className="flex w-max animate-marquee">
        {[0, 1].map((dup) => (
          <div key={dup} className="flex shrink-0" aria-hidden={dup === 1}>
            {items.map((item, i) => (
              <span key={i} className="label-caps flex items-center gap-2 px-6 py-2 text-[0.6875rem]">
                {item}
                <span className="text-primary">/</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
