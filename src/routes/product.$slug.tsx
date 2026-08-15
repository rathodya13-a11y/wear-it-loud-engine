import { createFileRoute, notFound } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Star } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Countdown } from "@/components/Countdown";
import { ProductCard } from "@/components/ProductCard";
import { useCart } from "@/lib/cart";
import {
  SALE_ENDS_AT,
  SIZES,
  formatINR,
  getProduct,
  products,
  type Size,
} from "@/lib/products";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/product/$slug")({
  loader: ({ params }) => {
    const product = getProduct(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Unavailable — Gor Fashion House" }, { name: "robots", content: "noindex" }],
      };
    }
    const { product } = loaderData;
    const title = `${product.name} — Gor Fashion House`;
    return {
      meta: [
        { title },
        { name: "description", content: `${product.blurb} ${product.fabric}. Sale price ${formatINR(product.price)}.` },
        { property: "og:title", content: title },
        { property: "og:description", content: product.blurb },
      ],
    };
  },
  component: ProductPage,
});

function ProductPage() {
  const { product } = Route.useLoaderData();
  const { add } = useCart();
  const [size, setSize] = useState<Size | null>(null);
  const [active, setActive] = useState(0);
  const [showSticky, setShowSticky] = useState(false);
  const ctaRef = useRef<HTMLDivElement>(null);

  const gallery = [product.image, product.hoverImage, product.image];
  const save = product.mrp - product.price;
  const selectedStock = size ? product.stock[size] : null;

  useEffect(() => {
    const el = ctaRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => setShowSticky(!entry.isIntersecting), {
      threshold: 0,
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const onAdd = () => {
    if (!size) return;
    add(product, size);
  };

  return (
    <>
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 lg:grid-cols-2">
        {/* Gallery */}
        <div className="flex gap-3">
          <div className="hidden flex-col gap-2 sm:flex">
            {gallery.map((src, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={cn(
                  "size-20 overflow-hidden border-2 transition-colors",
                  active === i ? "border-primary" : "border-transparent",
                )}
                aria-label={`View image ${i + 1}`}
              >
                <img src={src} alt="" width={1024} height={1024} loading="lazy" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
          <div className="flex-1">
            <div className="flex snap-x snap-mandatory gap-2 overflow-x-auto sm:block">
              {gallery.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={product.name}
                  width={1024}
                  height={1024}
                  className={cn(
                    "aspect-square w-full shrink-0 snap-center bg-muted object-cover",
                    i === active ? "sm:block" : "sm:hidden",
                  )}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Urgency stack */}
        <div>
          <p className="label-caps text-muted-foreground">{product.category} tee</p>
          <h1 className="display-lg mt-1">{product.name}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{product.blurb}</p>

          <div className="mt-5 flex items-baseline gap-3">
            <span className="font-display text-3xl text-primary">{formatINR(product.price)}</span>
            <span className="text-base text-muted-foreground line-through">
              {formatINR(product.mrp)}
            </span>
            <span className="label-caps bg-primary px-2 py-1 text-primary-foreground">
              Save {formatINR(save)}
            </span>
          </div>

          {selectedStock !== null && selectedStock > 0 && selectedStock <= 4 && (
            <p className="label-caps mt-3 w-fit bg-scarcity px-2 py-1 text-scarcity-foreground">
              Only {selectedStock} left in size {size} — restock not guaranteed
            </p>
          )}

          <div className="mt-4 flex items-center gap-2">
            <span className="label-caps">Sale ends in</span>
            <Countdown endsAt={SALE_ENDS_AT} />
          </div>

          <div className="mt-4 flex items-center gap-2 text-sm">
            <span className="flex text-scarcity" aria-hidden>
              {[0, 1, 2, 3, 4].map((i) => (
                <Star key={i} className="size-4 fill-current" />
              ))}
            </span>
            <span className="font-semibold">{product.rating}</span>
            <span className="text-muted-foreground">({product.reviews} reviews)</span>
          </div>

          {/* Size selector */}
          <div className="mt-6">
            <div className="flex items-center justify-between">
              <p className="label-caps">Select size</p>
              <Dialog>
                <DialogTrigger className="text-xs underline">Size guide</DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Size guide (inches)</DialogTitle>
                  </DialogHeader>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="label-caps text-left">
                        <th className="py-2">Size</th>
                        <th className="py-2">Chest</th>
                        <th className="py-2">Length</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ["S", 38, 27],
                        ["M", 40, 28],
                        ["L", 42, 29],
                        ["XL", 44, 30],
                        ["XXL", 46, 31],
                      ].map(([s, c, l]) => (
                        <tr key={s} className="border-t border-border">
                          <td className="py-2 font-semibold">{s}</td>
                          <td className="py-2">{c}</td>
                          <td className="py-2">{l}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </DialogContent>
              </Dialog>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {SIZES.map((s) => {
                const soldOut = product.stock[s] === 0;
                return (
                  <button
                    key={s}
                    disabled={soldOut}
                    onClick={() => setSize(s)}
                    className={cn(
                      "label-caps h-11 min-w-14 rounded-full border transition-colors",
                      soldOut && "cursor-not-allowed text-muted-foreground line-through opacity-60",
                      size === s
                        ? "border-ink bg-ink text-ink-foreground"
                        : "border-input hover:bg-accent",
                    )}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>

          <div ref={ctaRef} className="mt-6">
            <Button variant="sale" size="lg" className="w-full" onClick={onAdd} disabled={!size}>
              {size ? "Grab yours before it's gone" : "Select a size"}
            </Button>
          </div>

          <Accordion type="single" collapsible className="mt-8">
            <AccordionItem value="fabric">
              <AccordionTrigger className="label-caps">Fabric & fit</AccordionTrigger>
              <AccordionContent>
                {product.fabric}. {product.fit}.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="print">
              <AccordionTrigger className="label-caps">Print method</AccordionTrigger>
              <AccordionContent>{product.print}</AccordionContent>
            </AccordionItem>
            <AccordionItem value="care">
              <AccordionTrigger className="label-caps">Wash care</AccordionTrigger>
              <AccordionContent>{product.care}</AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      {/* Reviews */}
      <section className="mx-auto max-w-7xl px-4 py-10">
        <h2 className="display-sm">Reviews ({product.reviews})</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <article className="border border-border p-4">
            <img
              src={product.hoverImage}
              alt="Customer photo review"
              width={1024}
              height={1024}
              loading="lazy"
              className="aspect-square w-full object-cover"
            />
            <div className="mt-3 text-scarcity">★★★★★</div>
            <p className="mt-1 text-sm">Print hasn't cracked after a month. Buying a second.</p>
            <p className="mt-2 text-xs text-muted-foreground">Karan V. — verified buyer</p>
          </article>
          {[
            { name: "Meera J.", text: "Fits oversized as promised. Fabric feels premium." },
            { name: "Sahil D.", text: "Delivered in 3 days to Pune. Packaging was solid." },
          ].map((r) => (
            <article key={r.name} className="border border-border p-4">
              <div className="text-scarcity">★★★★★</div>
              <p className="mt-1 text-sm">{r.text}</p>
              <p className="mt-2 text-xs text-muted-foreground">{r.name} — verified buyer</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-14">
        <h2 className="display-sm">Pairs well with</h2>
        <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {products
            .filter((p) => p.slug !== product.slug)
            .slice(0, 4)
            .map((p, i) => (
              <ProductCard key={p.slug} product={p} index={i} />
            ))}
        </div>
      </section>

      {/* Sticky mobile-first ATC */}
      <div
        className={cn(
          "fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 p-3 backdrop-blur transition-transform duration-200",
          showSticky ? "translate-y-0" : "translate-y-full",
        )}
      >
        <div className="mx-auto flex max-w-3xl items-center gap-3">
          <div className="hidden sm:block">
            <p className="text-sm font-bold">{product.name}</p>
            <p className="font-display text-sm text-primary">{formatINR(product.price)}</p>
          </div>
          <Button variant="sale" size="lg" className="flex-1" onClick={onAdd} disabled={!size}>
            {size ? `Add ${size} — ${formatINR(product.price)}` : "Select a size"}
          </Button>
        </div>
      </div>
    </>
  );
}
