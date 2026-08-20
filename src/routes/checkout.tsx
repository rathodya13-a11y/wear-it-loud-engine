import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Lock, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Countdown } from "@/components/Countdown";
import { useCart } from "@/lib/cart";
import { SALE_ENDS_AT, formatINR } from "@/lib/products";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — Gor Fashion House" },
      { name: "description", content: "Secure single-page checkout. COD available across India." },
      { property: "og:title", content: "Checkout — Gor Fashion House" },
      { property: "og:description", content: "Secure single-page checkout with COD available." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Checkout,
});

function Checkout() {
  const { lines, subtotal, savings, clear } = useCart();
  const [placed, setPlaced] = useState(false);
  const shipping = subtotal >= 999 || subtotal === 0 ? 0 : 79;

  if (placed) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <h1 className="display-lg">Order locked in</h1>
        <p className="mt-3 text-muted-foreground">
          Confirmation is on its way. Track it any time from the contact page.
        </p>
        <Button variant="sale" size="lg" className="mt-6" asChild>
          <Link to="/shop">Keep shopping</Link>
        </Button>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <h1 className="display-lg">Nothing to check out</h1>
        <Button variant="sale" size="lg" className="mt-6" asChild>
          <Link to="/shop">Shop the sale</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-10 px-4 py-10 lg:grid-cols-[1.2fr_1fr]">
      <form
        className="flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          clear();
          setPlaced(true);
          toast.success("Order placed. You'll get a confirmation email shortly.");
        }}
      >
        <div>
          <h1 className="display-lg">Checkout</h1>
          <div className="mt-2 flex items-center gap-2">
            <span className="label-caps text-muted-foreground">Sale price held for</span>
            <Countdown endsAt={SALE_ENDS_AT} />
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" className="mt-1 h-11" required />
          </div>
          <div>
            <Label htmlFor="name">Full name</Label>
            <Input id="name" className="mt-1 h-11" required />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" type="tel" className="mt-1 h-11" required />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="address">Address</Label>
            <Input id="address" className="mt-1 h-11" required />
          </div>
          <div>
            <Label htmlFor="city">City</Label>
            <Input id="city" className="mt-1 h-11" required />
          </div>
          <div>
            <Label htmlFor="pin">PIN code</Label>
            <Input id="pin" inputMode="numeric" className="mt-1 h-11" required />
          </div>
        </div>

        <Button variant="sale" size="lg" type="submit" className="mt-2 w-full">
          Pay {formatINR(subtotal + shipping)}
        </Button>

        <ul className="flex flex-wrap gap-4 text-xs text-muted-foreground">
          <li className="flex items-center gap-1">
            <Lock className="size-3.5" /> 256-bit secure
          </li>
          <li className="flex items-center gap-1">
            <ShieldCheck className="size-3.5" /> COD available
          </li>
          <li className="flex items-center gap-1">
            <RotateCcw className="size-3.5" /> 7-day returns
          </li>
          <li className="flex items-center gap-1">
            <Truck className="size-3.5" /> Ships in 24h
          </li>
        </ul>
      </form>

      <aside className="h-fit border border-border p-4">
        <p className="label-caps">Order summary</p>
        <ul className="mt-4 flex flex-col gap-3">
          {lines.map((l) => (
            <li key={`${l.slug}-${l.size}`} className="flex gap-3">
              <img
                src={l.image}
                alt={l.name}
                width={1024}
                height={1024}
                loading="lazy"
                className="size-16 object-cover"
              />
              <div className="flex-1 text-sm">
                <p className="font-bold">{l.name}</p>
                <p className="text-xs text-muted-foreground">
                  Size {l.size} · Qty {l.qty}
                </p>
              </div>
              <span className="font-display text-sm">{formatINR(l.price * l.qty)}</span>
            </li>
          ))}
        </ul>
        <dl className="mt-5 flex flex-col gap-2 border-t border-border pt-4 text-sm">
          <div className="flex justify-between">
            <dt>Subtotal</dt>
            <dd>{formatINR(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Shipping</dt>
            <dd>{shipping === 0 ? "Free" : formatINR(shipping)}</dd>
          </div>
          <div className="flex justify-between font-bold">
            <dt>Total</dt>
            <dd className="font-display text-lg text-primary">{formatINR(subtotal + shipping)}</dd>
          </div>
        </dl>
        {savings > 0 && (
          <p className="mt-3 text-xs text-muted-foreground">
            Drop pricing saves you {formatINR(savings)}.
          </p>
        )}
      </aside>
    </div>
  );
}
