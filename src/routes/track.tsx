import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OrderSummary } from "@/components/OrderSummary";
import { trackOrder, type TrackedOrder } from "@/lib/shop.functions";

export const Route = createFileRoute("/track")({
  validateSearch: (search: Record<string, unknown>) => ({
    code: typeof search.code === "string" ? search.code : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Track your order — Gor Fashion House" },
      {
        name: "description",
        content: "Enter your order ID and email to see live status of your Gor Fashion House order.",
      },
      { property: "og:title", content: "Track your order — Gor Fashion House" },
      { property: "og:description", content: "Live status for your Gor Fashion House order." },
    ],
  }),
  component: TrackPage,
});

function TrackPage() {
  const { code } = Route.useSearch();
  const track = useServerFn(trackOrder);
  const [orderCode, setOrderCode] = useState(code ?? "");
  const [email, setEmail] = useState("");
  const [order, setOrder] = useState<TrackedOrder | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setOrder(null);
    try {
      const res = await track({ data: { orderCode, email } });
      if (res.ok) setOrder(res.order);
      else setError(res.message);
    } catch {
      setError("Couldn't look that up right now. Try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl px-4 py-14">
      <h1 className="display-lg">Track your order</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Use the order ID from your confirmation plus the email you ordered with.
      </p>

      <form className="mt-6 flex flex-col gap-3" onSubmit={submit}>
        <div>
          <Label htmlFor="orderCode">Order ID</Label>
          <Input
            id="orderCode"
            value={orderCode}
            onChange={(e) => setOrderCode(e.target.value)}
            placeholder="GOR-10482"
            className="mt-1 h-11"
            required
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 h-11"
            required
          />
        </div>
        <Button variant="sale" size="lg" type="submit" disabled={busy}>
          {busy ? "Checking…" : "Track it"}
        </Button>
      </form>

      {error && (
        <p className="label-caps mt-5 w-fit bg-primary px-2 py-1 text-primary-foreground">{error}</p>
      )}
      {order && <OrderSummary order={order} className="mt-8" />}
    </div>
  );
}
