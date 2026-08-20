import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const promoInput = z.object({
  code: z.string().min(1).max(40),
  subtotal: z.number().int().min(0),
});

const lineInput = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  size: z.string().min(1).max(4),
  qty: z.number().int().min(1).max(20),
  price: z.number().int().min(0),
});

const orderInput = z.object({
  email: z.string().email(),
  fullName: z.string().min(1).max(120),
  phone: z.string().min(6).max(20),
  address: z.string().min(4).max(300),
  city: z.string().min(1).max(80),
  pin: z.string().min(4).max(10),
  promoCode: z.string().max(40).nullable(),
  lines: z.array(lineInput).min(1).max(30),
});

const trackInput = z.object({
  orderCode: z.string().min(3).max(30),
  email: z.string().email(),
});

export type PromoResult =
  { ok: true; code: string; discount: number } | { ok: false; message: string };

export const validatePromo = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => promoInput.parse(input))
  .handler(async ({ data }): Promise<PromoResult> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: result, error } = await supabaseAdmin.rpc("validate_promo", {
      _code: data.code,
      _subtotal: data.subtotal,
    });
    if (error) return { ok: false, message: "Couldn't check that code. Try again." };
    const r = result as { ok: boolean; code?: string; discount?: number; message?: string };
    if (!r.ok) return { ok: false, message: r.message ?? "That code isn't valid." };
    return { ok: true, code: r.code ?? data.code.toUpperCase(), discount: r.discount ?? 0 };
  });

export const placeOrder = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => orderInput.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Prices are re-derived server-side; never trust client totals.
    const subtotal = data.lines.reduce((n, l) => n + l.price * l.qty, 0);

    let discount = 0;
    let promoCode: string | null = null;
    if (data.promoCode) {
      const { data: result } = await supabaseAdmin.rpc("validate_promo", {
        _code: data.promoCode,
        _subtotal: subtotal,
      });
      const r = result as { ok: boolean; code?: string; discount?: number } | null;
      if (r?.ok) {
        discount = r.discount ?? 0;
        promoCode = r.code ?? data.promoCode.toUpperCase();
      }
    }

    const afterDiscount = subtotal - discount;
    const shipping = afterDiscount >= 999 ? 0 : 79;
    const total = afterDiscount + shipping;
    const orderCode = `GOR-${Math.floor(10000 + Math.random() * 89999)}`;

    const { data: inserted, error } = await supabaseAdmin
      .from("orders")
      .insert({
        order_code: orderCode,
        email: data.email,
        full_name: data.fullName,
        phone: data.phone,
        address: data.address,
        city: data.city,
        pin: data.pin,
        items: data.lines,
        subtotal,
        discount,
        shipping,
        total,
        promo_code: promoCode,
      })
      .select("order_code")
      .single();

    if (error || !inserted) throw new Error("We couldn't place that order. Please try again.");

    // Decrement live stock for each purchased size.
    for (const line of data.lines) {
      const { data: row } = await supabaseAdmin
        .from("inventory")
        .select("stock")
        .eq("product_slug", line.slug)
        .eq("size", line.size)
        .maybeSingle();
      if (row) {
        await supabaseAdmin
          .from("inventory")
          .update({ stock: Math.max(0, row.stock - line.qty) })
          .eq("product_slug", line.slug)
          .eq("size", line.size);
      }
    }

    return { orderCode: inserted.order_code, total, discount, shipping, subtotal };
  });

export type TrackedOrder = {
  order_code: string;
  status: string;
  full_name: string;
  city: string;
  items: { name: string; size: string; qty: number; price: number }[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  promo_code: string | null;
  created_at: string;
};

export const trackOrder = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => trackInput.parse(input))
  .handler(
    async ({
      data,
    }): Promise<{ ok: true; order: TrackedOrder } | { ok: false; message: string }> => {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { data: result, error } = await supabaseAdmin.rpc("track_order", {
        _order_code: data.orderCode,
        _email: data.email,
      });
      if (error) return { ok: false, message: "Couldn't look that up. Try again." };
      const r = result as ({ ok: boolean; message?: string } & TrackedOrder) | null;
      if (!r?.ok) return { ok: false, message: r?.message ?? "No order matched." };
      return { ok: true, order: r };
    },
  );
