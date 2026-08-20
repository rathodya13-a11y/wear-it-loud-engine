import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { SIZES, products, type Size } from "@/lib/products";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop All Printed Tees — Gor Fashion House" },
      {
        name: "description",
        content:
          "Filter every Gor Fashion House graphic tee by size, price and category. Flash sale pricing live.",
      },
      { property: "og:title", content: "Shop All Printed Tees — Gor Fashion House" },
      {
        property: "og:description",
        content: "Every graphic tee in the drop. Filter by size, price and category.",
      },
    ],
  }),
  component: Shop,
});

const categories = ["All", "Graphic", "Typography", "Oversized"] as const;
const sorts = [
  { id: "featured", label: "Featured" },
  { id: "low", label: "Price: low to high" },
  { id: "high", label: "Price: high to low" },
  { id: "discount", label: "Biggest discount" },
] as const;

function Shop() {
  const [category, setCategory] = useState<(typeof categories)[number]>("All");
  const [size, setSize] = useState<Size | null>(null);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [sort, setSort] = useState<(typeof sorts)[number]["id"]>("featured");

  const list = useMemo(() => {
    const filtered = products.filter(
      (p) =>
        (category === "All" || p.category === category) &&
        (!size || p.stock[size] > 0) &&
        p.price <= maxPrice,
    );
    const sorted = [...filtered];
    if (sort === "low") sorted.sort((a, b) => a.price - b.price);
    if (sort === "high") sorted.sort((a, b) => b.price - a.price);
    if (sort === "discount")
      sorted.sort((a, b) => (b.mrp - b.price) / b.mrp - (a.mrp - a.price) / a.mrp);
    return sorted;
  }, [category, size, maxPrice, sort]);

  return (
    <>
      <header className="border-b border-border px-4 py-10">
        <div className="mx-auto max-w-7xl">
          <h1 className="display-lg">The full drop</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {list.length} tees ready to ship. Sale pricing applied.
          </p>
        </div>
      </header>

      <div className="sticky top-16 z-30 border-b border-border bg-background/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={cn(
                "label-caps h-11 border px-3 transition-colors",
                category === c
                  ? "border-ink bg-ink text-ink-foreground"
                  : "border-input hover:bg-accent",
              )}
            >
              {c}
            </button>
          ))}

          <div className="flex items-center gap-1">
            {SIZES.map((s) => (
              <button
                key={s}
                onClick={() => setSize(size === s ? null : s)}
                className={cn(
                  "label-caps h-11 w-11 border transition-colors",
                  size === s
                    ? "border-ink bg-ink text-ink-foreground"
                    : "border-input hover:bg-accent",
                )}
              >
                {s}
              </button>
            ))}
          </div>

          <label className="flex items-center gap-2 text-xs font-semibold">
            Under ₹{maxPrice}
            <input
              type="range"
              min={699}
              max={1000}
              step={50}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="h-11 w-28 accent-[oklch(0.55_0.225_27.5)]"
            />
          </label>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as typeof sort)}
            className="label-caps ml-auto h-11 border border-input bg-background px-2"
          >
            {sorts.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-4 py-10">
        {list.length === 0 ? (
          <div className="py-16 text-center">
            <p className="display-sm">Nothing matches that</p>
            <Button
              variant="sale"
              className="mt-4"
              onClick={() => {
                setCategory("All");
                setSize(null);
                setMaxPrice(1000);
              }}
            >
              Clear filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {list.map((p, i) => (
              <ProductCard key={p.slug} product={p} index={i} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
