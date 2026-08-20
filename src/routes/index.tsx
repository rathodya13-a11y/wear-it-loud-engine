import { createFileRoute, Link } from "@tanstack/react-router";
import { BadgeCheck, Banknote, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import hero from "@/assets/hero.jpg";
import tee1 from "@/assets/tee-1.jpg";
import tee2 from "@/assets/tee-2.jpg";
import tee3 from "@/assets/tee-3.jpg";
import tee4 from "@/assets/tee-4.jpg";
import { Button } from "@/components/ui/button";
import { Countdown } from "@/components/Countdown";
import { ProductCard } from "@/components/ProductCard";
import { SALE_ENDS_AT, products } from "@/lib/products";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Gor Fashion House — Loud Tees, Louder Attitude" },
      {
        name: "description",
        content:
          "Bold printed graphic tees from Gor Fashion House. Flash drop live — up to 40% off, free shipping over ₹999.",
      },
      { property: "og:title", content: "Gor Fashion House — Loud Tees, Louder Attitude" },
      {
        property: "og:description",
        content: "Bold printed graphic tees. Flash drop live — up to 40% off.",
      },
    ],
  }),
  component: Home,
});

const trust = [
  { icon: Truck, label: "Free shipping over ₹999" },
  { icon: RotateCcw, label: "7-day easy returns" },
  { icon: ShieldCheck, label: "Secure payments" },
  { icon: Banknote, label: "COD available" },
];

const reviews = [
  {
    name: "Aditya R.",
    text: "Print quality is insane. Washed it five times, still looks fresh off the drop.",
  },
  { name: "Nikita S.", text: "Fit is exactly as pictured. Got compliments the first day." },
  { name: "Rohan M.", text: "Shipped in two days. Heavy fabric, not the thin stuff." },
];

function Home() {
  const best = products
    .filter((p) => p.bestseller)
    .concat(products.slice(0, 4))
    .slice(0, 4);

  return (
    <>
      {/* B. Hero */}
      <section className="relative min-h-[85svh] overflow-hidden bg-ink">
        <img
          src={hero}
          alt="Model wearing a bold black graphic tee from Gor Fashion House"
          width={1600}
          height={1200}
          className="absolute inset-0 h-full w-full object-cover object-[60%_center] opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/70 to-transparent" />
        <div className="relative mx-auto flex min-h-[85svh] max-w-7xl flex-col justify-end gap-5 px-4 pb-14 pt-24 text-ink-foreground sm:justify-center">
          <span className="label-caps w-fit animate-rise bg-scarcity px-2.5 py-1 text-scarcity-foreground">
            New drop
          </span>
          <h1 className="display-xl max-w-2xl animate-rise" style={{ animationDelay: "60ms" }}>
            Loud tees.
            <br />
            Louder attitude.
          </h1>
          <p
            className="max-w-md animate-rise text-base text-ink-foreground/85"
            style={{ animationDelay: "120ms" }}
          >
            Graphic tees for people who refuse to blend in.
          </p>
          <div
            className="flex animate-rise flex-wrap items-center gap-3"
            style={{ animationDelay: "180ms" }}
          >
            <Button variant="sale" size="lg" asChild>
              <Link to="/shop">Shop now</Link>
            </Button>
            <Button variant="onDark" size="lg" asChild>
              <Link to="/shop">View collection</Link>
            </Button>
          </div>
          <div className="animate-rise" style={{ animationDelay: "240ms" }}>
            <p className="label-caps mb-2 text-ink-foreground/70">Drop pricing ends in</p>
            <Countdown endsAt={SALE_ENDS_AT} />
          </div>
        </div>
      </section>

      {/* C. Flash sale strip */}
      <section className="bg-primary px-4 py-6 text-primary-foreground">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 sm:flex-row">
          <div>
            <h2 className="display-lg">Flash drop — up to 40% off</h2>
            <p className="label-caps mt-1 opacity-90">Ends when the clock hits zero</p>
          </div>
          <Countdown endsAt={SALE_ENDS_AT} size="lg" />
          <Button variant="ink" size="lg" asChild>
            <Link to="/shop">Shop the sale</Link>
          </Button>
        </div>
      </section>

      {/* D. Best sellers */}
      <section className="mx-auto max-w-7xl px-4 py-14">
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2 className="display-lg">Best sellers</h2>
          <Link to="/shop" className="label-caps text-primary hover:underline">
            See all
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {best.map((p, i) => (
            <ProductCard key={p.slug} product={p} index={i} />
          ))}
        </div>
      </section>

      {/* E. Trust strip */}
      <section className="border-y border-border bg-muted px-4 py-6">
        <ul className="mx-auto grid max-w-7xl grid-cols-2 gap-4 md:grid-cols-4">
          {trust.map((t) => (
            <li key={t.label} className="flex items-center gap-2">
              <t.icon className="size-5 shrink-0 stroke-[1.5] text-foreground" />
              <span className="text-xs font-semibold">{t.label}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* F. Social proof */}
      <section className="mx-auto max-w-7xl px-4 py-14">
        <h2 className="display-lg">Tag us @gorfashionhouse</h2>
        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          {[tee1, tee2, tee3, tee4].map((src, i) => (
            <img
              key={i}
              src={src}
              alt="Customer wearing a Gor Fashion House tee"
              width={1024}
              height={1024}
              loading="lazy"
              className="aspect-square w-full animate-rise object-cover"
              style={{ animationDelay: `${i * 60}ms` }}
            />
          ))}
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {reviews.map((r) => (
            <blockquote key={r.name} className="border border-border p-4">
              <div className="text-scarcity" aria-label="5 out of 5 stars">
                ★★★★★
              </div>
              <p className="mt-2 text-sm">{r.text}</p>
              <footer className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
                <BadgeCheck className="size-3.5" /> {r.name} — verified buyer
              </footer>
            </blockquote>
          ))}
        </div>
      </section>
    </>
  );
}
