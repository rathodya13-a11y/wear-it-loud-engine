import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Product, Size } from "@/lib/products";

export type CartLine = {
  slug: string;
  name: string;
  size: Size;
  price: number;
  mrp: number;
  image: string;
  qty: number;
};

type CartValue = {
  lines: CartLine[];
  count: number;
  subtotal: number;
  savings: number;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  add: (product: Product, size: Size) => void;
  setQty: (slug: string, size: Size, qty: number) => void;
  remove: (slug: string, size: Size) => void;
  clear: () => void;
};

const CartContext = createContext<CartValue | null>(null);
const STORAGE_KEY = "gor-cart-v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setLines(JSON.parse(raw) as CartLine[]);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* ignore */
    }
  }, [lines]);

  const value = useMemo<CartValue>(() => {
    const count = lines.reduce((n, l) => n + l.qty, 0);
    const subtotal = lines.reduce((n, l) => n + l.qty * l.price, 0);
    const savings = lines.reduce((n, l) => n + l.qty * (l.mrp - l.price), 0);

    return {
      lines,
      count,
      subtotal,
      savings,
      isOpen,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      add: (product, size) => {
        setLines((prev) => {
          const existing = prev.find((l) => l.slug === product.slug && l.size === size);
          if (existing) {
            return prev.map((l) =>
              l.slug === product.slug && l.size === size ? { ...l, qty: l.qty + 1 } : l,
            );
          }
          return [
            ...prev,
            {
              slug: product.slug,
              name: product.name,
              size,
              price: product.price,
              mrp: product.mrp,
              image: product.image,
              qty: 1,
            },
          ];
        });
        setIsOpen(true);
      },
      setQty: (slug, size, qty) =>
        setLines((prev) =>
          qty <= 0
            ? prev.filter((l) => !(l.slug === slug && l.size === size))
            : prev.map((l) => (l.slug === slug && l.size === size ? { ...l, qty } : l)),
        ),
      remove: (slug, size) =>
        setLines((prev) => prev.filter((l) => !(l.slug === slug && l.size === size))),
      clear: () => setLines([]),
    };
  }, [lines, isOpen]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
