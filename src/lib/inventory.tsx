import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SIZES, type Product, type Size } from "@/lib/products";

export type StockMap = Record<string, Record<Size, number>>;

type InventoryValue = {
  stock: StockMap;
  live: boolean;
};

const InventoryContext = createContext<InventoryValue>({ stock: {}, live: false });

/**
 * Live inventory from the database. Rows stream in over realtime, so stock
 * badges and "Only X left" update without a refresh.
 */
export function InventoryProvider({ children }: { children: ReactNode }) {
  const [stock, setStock] = useState<StockMap>({});
  const [live, setLive] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const { data, error } = await supabase.from("inventory").select("product_slug, size, stock");
      if (cancelled || error || !data) return;
      const next: StockMap = {};
      for (const row of data) {
        const size = row.size as Size;
        if (!SIZES.includes(size)) continue;
        next[row.product_slug] = {
          ...(next[row.product_slug] ?? ({} as Record<Size, number>)),
          [size]: row.stock,
        } as Record<Size, number>;
      }
      setStock(next);
      setLive(true);
    };

    void load();

    const channel = supabase
      .channel("inventory-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "inventory" }, (payload) => {
        const row = (payload.new ?? payload.old) as {
          product_slug: string;
          size: string;
          stock: number;
        } | null;
        if (!row) return;
        const size = row.size as Size;
        if (!SIZES.includes(size)) return;
        setStock((prev) => ({
          ...prev,
          [row.product_slug]: {
            ...(prev[row.product_slug] ?? ({} as Record<Size, number>)),
            [size]: row.stock,
          } as Record<Size, number>,
        }));
      })
      .subscribe();

    return () => {
      cancelled = true;
      void supabase.removeChannel(channel);
    };
  }, []);

  const value = useMemo(() => ({ stock, live }), [stock, live]);

  return <InventoryContext.Provider value={value}>{children}</InventoryContext.Provider>;
}

/** Live per-size stock for a product, falling back to the bundled catalogue. */
export function useStock(product: Product): Record<Size, number> {
  const { stock } = useContext(InventoryContext);
  const live = stock[product.slug];
  if (!live) return product.stock;
  return SIZES.reduce(
    (acc, s) => ({ ...acc, [s]: live[s] ?? product.stock[s] }),
    {} as Record<Size, number>,
  );
}

export function useInventoryLive() {
  return useContext(InventoryContext).live;
}
