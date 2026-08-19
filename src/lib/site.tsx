import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SALE_ENDS_AT } from "@/lib/products";

export type SiteSettings = {
  brand_name: string;
  tagline: string;
  logo_url: string | null;
  sale_ends_at: string;
  free_shipping_threshold: number;
};

export type Banner = { id: string; message: string; sort_order: number };

const FALLBACK: SiteSettings = {
  brand_name: "Gor Fashion House",
  tagline: "Wear it loud",
  logo_url: null,
  sale_ends_at: SALE_ENDS_AT,
  free_shipping_threshold: 999,
};

type SiteValue = { settings: SiteSettings; banners: Banner[] };

const SiteContext = createContext<SiteValue>({ settings: FALLBACK, banners: [] });

/** Live branding + announcement banners, admin-editable from /admin. */
export function SiteProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(FALLBACK);
  const [banners, setBanners] = useState<Banner[]>([]);

  useEffect(() => {
    let cancelled = false;

    const loadSettings = async () => {
      const { data } = await supabase
        .from("site_settings")
        .select("brand_name, tagline, logo_url, sale_ends_at, free_shipping_threshold")
        .eq("id", 1)
        .maybeSingle();
      if (!cancelled && data) setSettings(data as SiteSettings);
    };

    const loadBanners = async () => {
      const { data } = await supabase
        .from("banners")
        .select("id, message, sort_order")
        .eq("active", true)
        .order("sort_order", { ascending: true });
      if (!cancelled && data) setBanners(data as Banner[]);
    };

    void loadSettings();
    void loadBanners();

    const channel = supabase
      .channel("site-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "banners" }, () => {
        void loadBanners();
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "site_settings" }, () => {
        void loadSettings();
      })
      .subscribe();

    return () => {
      cancelled = true;
      void supabase.removeChannel(channel);
    };
  }, []);

  const value = useMemo(() => ({ settings, banners }), [settings, banners]);
  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSite() {
  return useContext(SiteContext);
}
