import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SIZES, products as staticProducts, type Product, type Size } from "@/lib/products";

export type DbProductRow = {
  slug: string;
  name: string;
  category: string;
  price: number;
  mrp: number;
  image_url: string;
  hover_image_url: string | null;
  rating: number;
  reviews: number;
  bestseller: boolean;
  fabric: string;
  fit: string;
  print: string;
  care: string;
  blurb: string;
  stock: unknown;
};

function toStock(raw: unknown): Record<Size, number> {
  const obj = (raw ?? {}) as Record<string, number>;
  return SIZES.reduce(
    (acc, s) => ({ ...acc, [s]: Number(obj[s] ?? 0) }),
    {} as Record<Size, number>,
  );
}

export function mapDbProduct(row: DbProductRow): Product {
  return {
    slug: row.slug,
    name: row.name,
    category: (["Graphic", "Typography", "Oversized"].includes(row.category)
      ? row.category
      : "Graphic") as Product["category"],
    price: row.price,
    mrp: row.mrp,
    image: row.image_url,
    hoverImage: row.hover_image_url ?? row.image_url,
    rating: Number(row.rating),
    reviews: row.reviews,
    bestseller: row.bestseller,
    stock: toStock(row.stock),
    fabric: row.fabric,
    fit: row.fit,
    print: row.print,
    care: row.care,
    blurb: row.blurb,
  };
}

type CatalogValue = { products: Product[]; loaded: boolean };

const CatalogContext = createContext<CatalogValue>({ products: staticProducts, loaded: false });

const SELECT =
  "slug, name, category, price, mrp, image_url, hover_image_url, rating, reviews, bestseller, fabric, fit, print, care, blurb, stock";

/**
 * Storefront catalogue: bundled products plus anything the admin adds in the
 * database (database rows win when slugs collide).
 */
export function CatalogProvider({ children }: { children: ReactNode }) {
  const [dbProducts, setDbProducts] = useState<Product[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const { data } = await supabase
        .from("products")
        .select(SELECT)
        .eq("active", true)
        .order("created_at", { ascending: false });
      if (cancelled) return;
      setDbProducts(((data ?? []) as DbProductRow[]).map(mapDbProduct));
      setLoaded(true);
    };

    void load();

    const channel = supabase
      .channel("catalog-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "products" }, () => {
        void load();
      })
      .subscribe();

    return () => {
      cancelled = true;
      void supabase.removeChannel(channel);
    };
  }, []);

  const value = useMemo(() => {
    const bySlug = new Map<string, Product>();
    for (const p of staticProducts) bySlug.set(p.slug, p);
    for (const p of dbProducts) bySlug.set(p.slug, p);
    return { products: Array.from(bySlug.values()), loaded };
  }, [dbProducts, loaded]);

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  return useContext(CatalogContext);
}

export function useProduct(slug: string): Product | undefined {
  return useCatalog().products.find((p) => p.slug === slug);
}
