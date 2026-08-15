import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Track Order & Contact — Gor Fashion House" },
      {
        name: "description",
        content: "Track your Gor Fashion House order or message the team. Replies within 24 hours.",
      },
      { property: "og:title", content: "Track Order & Contact — Gor Fashion House" },
      {
        property: "og:description",
        content: "Track your order or reach the Gor Fashion House team.",
      },
    ],
  }),
  component: Contact,
});

function Contact() {
  const [orderId, setOrderId] = useState("");

  return (
    <div className="mx-auto grid max-w-5xl gap-10 px-4 py-14 md:grid-cols-2">
      <section>
        <h1 className="display-lg">Track your order</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Enter the order ID from your confirmation email.
        </p>
        <form
          className="mt-5 flex flex-col gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            toast.success(`Order ${orderId || "—"} is packed and leaving our warehouse today.`);
          }}
        >
          <Label htmlFor="orderId">Order ID</Label>
          <Input
            id="orderId"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="GOR-10482"
            className="h-11"
            required
          />
          <Button variant="sale" size="lg" type="submit">
            Track it
          </Button>
        </form>
      </section>

      <section>
        <h2 className="display-lg">Talk to us</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Mon–Sat, 10am–7pm IST. We reply within 24 hours.
        </p>
        <form
          className="mt-5 flex flex-col gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            toast.success("Message sent. We'll get back within 24 hours.");
            (e.target as HTMLFormElement).reset();
          }}
        >
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" className="h-11" required />
          <Label htmlFor="msg">Message</Label>
          <Textarea id="msg" rows={5} required />
          <Button variant="ink" size="lg" type="submit">
            Send message
          </Button>
        </form>
      </section>
    </div>
  );
}
