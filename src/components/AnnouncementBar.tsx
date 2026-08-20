import { InlineCountdown } from "@/components/Countdown";
import { useSite } from "@/lib/site";

export function AnnouncementBar() {
  const { settings, banners } = useSite();

  const items: React.ReactNode[] =
    banners.length > 0
      ? banners.map((b) => <>{b.message}</>)
      : [
          <>
            🔥 Flash sale — 40% off ends in <InlineCountdown endsAt={settings.sale_ends_at} />
          </>,
          <>Free shipping over ₹{settings.free_shipping_threshold}</>,
          <>{settings.tagline}</>,
        ];

  return (
    <div className="overflow-hidden bg-ink text-ink-foreground">
      <div className="flex w-max animate-marquee">
        {[0, 1].map((dup) => (
          <div key={dup} className="flex shrink-0" aria-hidden={dup === 1}>
            {items.map((item, i) => (
              <span
                key={i}
                className="label-caps flex items-center gap-2 px-6 py-2 text-[0.6875rem]"
              >
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
