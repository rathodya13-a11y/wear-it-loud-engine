import { CheckCircle2, Package, Truck } from "lucide-react";
import { formatINR } from "@/lib/products";
import type { TrackedOrder } from "@/lib/shop.functions";
import { cn } from "@/lib/utils";

const STEPS = ["confirmed", "packed", "shipped", "delivered"] as const;

export function OrderSummary({ order, className }: { order: TrackedOrder; className?: string }) {
  const current = Math.max(0, STEPS.indexOf(order.status as (typeof STEPS)[number]));

  return (
    <section className={cn("border border-border p-5", className)}>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <p className="label-caps text-muted-foreground">Order</p>
          <p className="font-display text-2xl">{order.order_code}</p>
        </div>
        <span className="label-caps bg-ink px-2 py-1 text-ink-foreground">{order.status}</span>
      </div>

      <ol className="mt-5 flex flex-wrap gap-4">
        {STEPS.map((step, i) => (
          <li
            key={step}
            className={cn(
              "label-caps flex items-center gap-1.5 text-xs",
              i <= current ? "text-primary" : "text-muted-foreground",
            )}
          >
            {i === 0 ? (
              <CheckCircle2 className="size-4" />
            ) : i < 3 ? (
              <Package className="size-4" />
            ) : (
              <Truck className="size-4" />
            )}
            {step}
          </li>
        ))}
      </ol>

      <p className="mt-5 text-sm text-muted-foreground">
        Shipping to {order.full_name}, {order.city}
      </p>

      <ul className="mt-4 flex flex-col gap-2 border-t border-border pt-4 text-sm">
        {order.items.map((item, i) => (
          <li key={`${item.name}-${item.size}-${i}`} className="flex justify-between gap-3">
            <span>
              {item.name} · {item.size} × {item.qty}
            </span>
            <span className="font-display">{formatINR(item.price * item.qty)}</span>
          </li>
        ))}
      </ul>

      <dl className="mt-4 flex flex-col gap-1.5 border-t border-border pt-4 text-sm">
        <div className="flex justify-between">
          <dt>Subtotal</dt>
          <dd>{formatINR(order.subtotal)}</dd>
        </div>
        {order.discount > 0 && (
          <div className="flex justify-between text-primary">
            <dt>Promo {order.promo_code}</dt>
            <dd>−{formatINR(order.discount)}</dd>
          </div>
        )}
        <div className="flex justify-between">
          <dt>Shipping</dt>
          <dd>{order.shipping === 0 ? "Free" : formatINR(order.shipping)}</dd>
        </div>
        <div className="flex justify-between font-bold">
          <dt>Total</dt>
          <dd className="font-display text-lg text-primary">{formatINR(order.total)}</dd>
        </div>
      </dl>
    </section>
  );
}
