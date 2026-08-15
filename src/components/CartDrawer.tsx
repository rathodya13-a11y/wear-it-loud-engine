import { Link } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Countdown } from "@/components/Countdown";
import { useCart } from "@/lib/cart";
import { SALE_ENDS_AT, formatINR } from "@/lib/products";

export function CartDrawer() {
  const { isOpen, close, lines, subtotal, savings, setQty, remove } = useCart();
  const freeShippingGap = 999 - subtotal;

  return (
    <div className={isOpen ? "" : "pointer-events-none"} aria-hidden={!isOpen}>
      <div
        onClick={close}
        className={`fixed inset-0 z-50 bg-ink/60 transition-opacity duration-200 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />
      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-sm flex-col bg-background shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <p className="label-caps">Your bag</p>
          <button onClick={close} aria-label="Close cart" className="flex h-11 w-11 items-center justify-center">
            <X />
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <ShoppingBag className="size-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Bag's empty. Fix that.</p>
            <Button variant="sale" onClick={close} asChild>
              <Link to="/shop">Shop the sale</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-4 py-4">
              <div className="mb-4 flex items-center justify-between gap-2 bg-muted px-3 py-2">
                <span className="label-caps text-[0.625rem]">Sale ends in</span>
                <Countdown endsAt={SALE_ENDS_AT} />
              </div>
              {freeShippingGap > 0 && (
                <p className="mb-4 text-xs text-muted-foreground">
                  Add <strong className="text-foreground">{formatINR(freeShippingGap)}</strong> for
                  free shipping.
                </p>
              )}
              <ul className="flex flex-col gap-4">
                {lines.map((l) => (
                  <li key={`${l.slug}-${l.size}`} className="flex gap-3">
                    <img
                      src={l.image}
                      alt={l.name}
                      width={1024}
                      height={1024}
                      loading="lazy"
                      className="size-20 shrink-0 object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-bold">{l.name}</p>
                      <p className="text-xs text-muted-foreground">Size {l.size}</p>
                      <p className="mt-1 font-display text-sm text-primary">{formatINR(l.price)}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <button
                          aria-label="Decrease quantity"
                          onClick={() => setQty(l.slug, l.size, l.qty - 1)}
                          className="flex size-11 items-center justify-center border border-input"
                        >
                          <Minus className="size-3" />
                        </button>
                        <span className="w-6 text-center text-sm tabular-nums">{l.qty}</span>
                        <button
                          aria-label="Increase quantity"
                          onClick={() => setQty(l.slug, l.size, l.qty + 1)}
                          className="flex size-11 items-center justify-center border border-input"
                        >
                          <Plus className="size-3" />
                        </button>
                        <button
                          onClick={() => remove(l.slug, l.size)}
                          className="ml-auto text-xs text-muted-foreground underline"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-border p-4">
              <div className="flex items-baseline justify-between">
                <span className="label-caps">Subtotal</span>
                <span className="font-display text-xl text-primary">{formatINR(subtotal)}</span>
              </div>
              {savings > 0 && (
                <p className="mt-1 text-xs text-muted-foreground">
                  You save {formatINR(savings)} this drop.
                </p>
              )}
              <Button variant="sale" size="lg" className="mt-4 w-full" onClick={close} asChild>
                <Link to="/checkout">Checkout now</Link>
              </Button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
