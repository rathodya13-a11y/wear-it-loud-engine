import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OrderSummary } from "@/components/OrderSummary";
import { trackOrder, type TrackedOrder } from "@/lib/shop.functions";

export const LAST_ORDER_EMAIL_KEY = "gor-last-order-email";

export const Route = createFileRoute("/order/$code")({
  head: ({ params }) => ({
    meta: [
      { title: `Order ${params.code} — Gor Fashion House` },
      {
        name: "description",
        content: "Your Gor Fashion House order confirmation and live shipping status.",
      },
      { property: "og:title", content: `Order ${params.code} — Gor Fashion House` },
      { property: "og:description", content: "Order confirmation and live shipping status." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: OrderPage,
});

function OrderPage() {
  const { code } = Route.useParams();
  const track = useServerFn(trackOrder);
  const [order, setOrder] = useState<TrackedOrder | null>(null);
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const lookup = async (withEmail: string) => {
    setBusy(true);
    setError(null);
    try {
      const res = await track({ data: { orderCode: code, email: withEmail } });
      if (res.ok) setOrder(res.order);
      else setError(res.message);
    } catch {
      setError("Couldn't load that order right now.");
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem(LAST_ORDER_EMAIL_KEY);
    if (saved) {
      setEmail(saved);
      void lookup(saved);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  return (
    <div className="mx-auto max-w-xl px-4 py-14">
      <p className="label-caps text-primary">Order confirmed</p>
      <h1 className="display-lg mt-1">Order locked in</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Order <span className="font-semibold">{code}</span> — confirmation is on its way to your
        inbox.
      </p>

      {!order && (
        <form
          className="mt-6 flex flex-col gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            void lookup(email);
          }}
        >
          <Label htmlFor="email">Confirm your email to see the status</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-11"
            required
          />
          <Button variant="sale" size="lg" type="submit" disabled={busy}>
            {busy ? "Checking…" : "Show my order"}
          </Button>
          {error && (
            <p className="label-caps w-fit bg-primary px-2 py-1 text-primary-foreground">{error}</p>
          )}
        </form>
      )}

      {order && <OrderSummary order={order} className="mt-8" />}

      <div className="mt-8 flex flex-wrap gap-2">
        <Button variant="ink" size="lg" asChild>
          <Link to="/shop">Keep shopping</Link>
        </Button>
        <Button variant="outline" size="lg" asChild>
          <Link to="/track" search={{ code }}>
            Track later
          </Link>
        </Button>
      </div>
    </div>
  );
}
