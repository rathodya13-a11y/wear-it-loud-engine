import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { uploadProductImage } from "@/lib/admin.functions";
import { SIZES, type Size } from "@/lib/products";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Admin dashboard — Gor Fashion House" },
      {
        name: "description",
        content: "Manage branding, banners, promo codes, products and orders.",
      },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Admin dashboard — Gor Fashion House" },
      { property: "og:description", content: "Internal control panel for Gor Fashion House." },
    ],
  }),
  component: AdminPage,
});

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border border-border p-4 sm:p-6">
      <h2 className="label-caps mb-4">{title}</h2>
      {children}
    </section>
  );
}

function AdminPage() {
  const { isAdmin, loading, user } = useAuth();

  if (loading) {
    return <div className="px-4 py-24 text-center text-sm text-muted-foreground">Loading…</div>;
  }

  if (!user || !isAdmin) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <h1 className="display-lg">Admins only</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          This area is restricted. Sign in with the admin account to continue.
        </p>
        <Button variant="sale" className="mt-6" asChild>
          <Link to="/auth">Sign in</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="display-lg">Admin dashboard</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Everything on the storefront updates live for shoppers.
      </p>

      <Tabs defaultValue="branding" className="mt-8">
        <TabsList className="flex flex-wrap">
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="banners">Banners</TabsTrigger>
          <TabsTrigger value="promos">Promo codes</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
        </TabsList>

        <TabsContent value="branding" className="mt-6">
          <BrandingPanel />
        </TabsContent>
        <TabsContent value="banners" className="mt-6">
          <BannersPanel />
        </TabsContent>
        <TabsContent value="promos" className="mt-6">
          <PromosPanel />
        </TabsContent>
        <TabsContent value="products" className="mt-6">
          <ProductsPanel />
        </TabsContent>
        <TabsContent value="orders" className="mt-6">
          <OrdersPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function toLocalInput(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function BrandingPanel() {
  const [form, setForm] = useState({
    brand_name: "",
    tagline: "",
    logo_url: "",
    sale_ends_at: "",
    free_shipping_threshold: 999,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    void supabase
      .from("site_settings")
      .select("brand_name, tagline, logo_url, sale_ends_at, free_shipping_threshold")
      .eq("id", 1)
      .maybeSingle()
      .then(({ data }) => {
        if (!data) return;
        setForm({
          brand_name: data.brand_name,
          tagline: data.tagline,
          logo_url: data.logo_url ?? "",
          sale_ends_at: toLocalInput(data.sale_ends_at),
          free_shipping_threshold: data.free_shipping_threshold,
        });
      });
  }, []);

  const save = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("site_settings")
      .update({
        brand_name: form.brand_name,
        tagline: form.tagline,
        logo_url: form.logo_url || null,
        sale_ends_at: new Date(form.sale_ends_at).toISOString(),
        free_shipping_threshold: Number(form.free_shipping_threshold),
      })
      .eq("id", 1);
    setSaving(false);
    if (error) toast.error("Couldn't save branding.");
    else toast.success("Branding updated live.");
  };

  return (
    <Section title="Store branding & sale timer">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="brand">Brand name</Label>
          <Input
            id="brand"
            value={form.brand_name}
            onChange={(e) => setForm({ ...form, brand_name: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="tagline">Tagline</Label>
          <Input
            id="tagline"
            value={form.tagline}
            onChange={(e) => setForm({ ...form, tagline: e.target.value })}
          />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="logo">Logo URL (leave blank to use the chrome logo)</Label>
          <Input
            id="logo"
            value={form.logo_url}
            onChange={(e) => setForm({ ...form, logo_url: e.target.value })}
            placeholder="https://…"
          />
        </div>
        <div>
          <Label htmlFor="sale">Sale ends at</Label>
          <Input
            id="sale"
            type="datetime-local"
            value={form.sale_ends_at}
            onChange={(e) => setForm({ ...form, sale_ends_at: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="ship">Free shipping over (₹)</Label>
          <Input
            id="ship"
            type="number"
            value={form.free_shipping_threshold}
            onChange={(e) => setForm({ ...form, free_shipping_threshold: Number(e.target.value) })}
          />
        </div>
      </div>
      <Button variant="sale" className="mt-4" disabled={saving} onClick={() => void save()}>
        {saving ? "Saving…" : "Save branding"}
      </Button>
    </Section>
  );
}

type BannerRow = { id: string; message: string; active: boolean; sort_order: number };

function BannersPanel() {
  const [rows, setRows] = useState<BannerRow[]>([]);
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    const { data } = await supabase
      .from("banners")
      .select("id, message, active, sort_order")
      .order("sort_order", { ascending: true });
    setRows((data ?? []) as BannerRow[]);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const add = async () => {
    if (!message.trim()) return;
    const { error } = await supabase
      .from("banners")
      .insert({ message: message.trim(), sort_order: rows.length });
    if (error) toast.error("Couldn't add banner.");
    else {
      setMessage("");
      toast.success("Banner live.");
      void load();
    }
  };

  const toggle = async (row: BannerRow) => {
    await supabase.from("banners").update({ active: !row.active }).eq("id", row.id);
    void load();
  };

  const remove = async (row: BannerRow) => {
    await supabase.from("banners").delete().eq("id", row.id);
    void load();
  };

  return (
    <Section title="Announcement banners">
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="🔥 Buy 2 get 1 free — today only"
        />
        <Button variant="sale" onClick={() => void add()}>
          Add
        </Button>
      </div>
      <ul className="mt-4 divide-y divide-border">
        {rows.map((row) => (
          <li key={row.id} className="flex items-center justify-between gap-3 py-3">
            <span className="text-sm">{row.message}</span>
            <div className="flex items-center gap-3">
              <Switch checked={row.active} onCheckedChange={() => void toggle(row)} />
              <Button variant="outline" size="sm" onClick={() => void remove(row)}>
                Delete
              </Button>
            </div>
          </li>
        ))}
        {rows.length === 0 && (
          <li className="py-3 text-sm text-muted-foreground">
            No banners yet — the default flash-sale marquee is showing.
          </li>
        )}
      </ul>
    </Section>
  );
}

type PromoRow = {
  code: string;
  kind: string;
  value: number;
  min_subtotal: number;
  active: boolean;
};

function PromosPanel() {
  const [rows, setRows] = useState<PromoRow[]>([]);
  const [form, setForm] = useState({ code: "", kind: "percent", value: 10, min_subtotal: 0 });

  const load = useCallback(async () => {
    const { data } = await supabase
      .from("promo_codes")
      .select("code, kind, value, min_subtotal, active")
      .order("created_at", { ascending: false });
    setRows((data ?? []) as PromoRow[]);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const add = async () => {
    if (!form.code.trim()) return;
    const { error } = await supabase.from("promo_codes").insert({
      code: form.code.trim().toUpperCase(),
      kind: form.kind,
      value: Number(form.value),
      min_subtotal: Number(form.min_subtotal),
    });
    if (error) toast.error("Couldn't save that code — it may already exist.");
    else {
      toast.success("Promo code live.");
      setForm({ code: "", kind: "percent", value: 10, min_subtotal: 0 });
      void load();
    }
  };

  const toggle = async (row: PromoRow) => {
    await supabase.from("promo_codes").update({ active: !row.active }).eq("code", row.code);
    void load();
  };

  return (
    <Section title="Promo codes">
      <div className="grid gap-3 sm:grid-cols-4">
        <div>
          <Label htmlFor="pcode">Code</Label>
          <Input
            id="pcode"
            value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
          />
        </div>
        <div>
          <Label htmlFor="pkind">Type</Label>
          <select
            id="pkind"
            value={form.kind}
            onChange={(e) => setForm({ ...form, kind: e.target.value })}
            className="h-11 w-full border border-input bg-background px-3 text-sm"
          >
            <option value="percent">% off</option>
            <option value="flat">₹ off</option>
          </select>
        </div>
        <div>
          <Label htmlFor="pval">Value</Label>
          <Input
            id="pval"
            type="number"
            value={form.value}
            onChange={(e) => setForm({ ...form, value: Number(e.target.value) })}
          />
        </div>
        <div>
          <Label htmlFor="pmin">Min cart (₹)</Label>
          <Input
            id="pmin"
            type="number"
            value={form.min_subtotal}
            onChange={(e) => setForm({ ...form, min_subtotal: Number(e.target.value) })}
          />
        </div>
      </div>
      <Button variant="sale" className="mt-4" onClick={() => void add()}>
        Add promo code
      </Button>

      <ul className="mt-4 divide-y divide-border">
        {rows.map((row) => (
          <li key={row.code} className="flex items-center justify-between gap-3 py-3">
            <span className="text-sm">
              <strong>{row.code}</strong> —{" "}
              {row.kind === "percent" ? `${row.value}% off` : `₹${row.value} off`}
              {row.min_subtotal > 0 ? ` over ₹${row.min_subtotal}` : ""}
            </span>
            <Switch checked={row.active} onCheckedChange={() => void toggle(row)} />
          </li>
        ))}
      </ul>
    </Section>
  );
}

const emptyProduct = {
  slug: "",
  name: "",
  category: "Graphic",
  price: 799,
  mrp: 1499,
  image_url: "",
  hover_image_url: "",
  fabric: "240 GSM combed cotton",
  fit: "Regular",
  print: "DTF print",
  care: "Cold wash inside out",
  blurb: "",
};

function ProductsPanel() {
  const [form, setForm] = useState(emptyProduct);
  const [stock, setStock] = useState<Record<Size, number>>(
    SIZES.reduce((a, s) => ({ ...a, [s]: 10 }), {} as Record<Size, number>),
  );
  const [rows, setRows] = useState<{ slug: string; name: string; active: boolean }[]>([]);
  const [busy, setBusy] = useState(false);
  const upload = useServerFn(uploadProductImage);

  const load = useCallback(async () => {
    const { data } = await supabase
      .from("products")
      .select("slug, name, active")
      .order("created_at", { ascending: false });
    setRows(data ?? []);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const pickImage = async (file: File, field: "image_url" | "hover_image_url") => {
    setBusy(true);
    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result).split(",")[1] ?? "");
        reader.onerror = () => reject(new Error("read failed"));
        reader.readAsDataURL(file);
      });
      const res = await upload({
        data: { fileName: file.name, contentType: file.type || "image/jpeg", base64 },
      });
      setForm((f) => ({ ...f, [field]: res.url }));
      toast.success("Image uploaded.");
    } catch {
      toast.error("Upload failed. Try a smaller image.");
    } finally {
      setBusy(false);
    }
  };

  const save = async () => {
    if (!form.slug.trim() || !form.name.trim() || !form.image_url) {
      toast.error("Slug, name and a main image are required.");
      return;
    }
    setBusy(true);
    const { error } = await supabase.from("products").upsert(
      {
        ...form,
        slug: form.slug.trim().toLowerCase().replace(/\s+/g, "-"),
        hover_image_url: form.hover_image_url || null,
        stock,
        active: true,
      },
      { onConflict: "slug" },
    );
    setBusy(false);
    if (error) toast.error("Couldn't save the product.");
    else {
      toast.success("Product is live in the shop.");
      setForm(emptyProduct);
      void load();
    }
  };

  const toggle = async (slug: string, active: boolean) => {
    await supabase.from("products").update({ active: !active }).eq("slug", slug);
    void load();
  };

  return (
    <div className="grid gap-6">
      <Section title="Add or update a product">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              placeholder="loud-skull-tee"
            />
          </div>
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="cat">Category</Label>
            <select
              id="cat"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="h-11 w-full border border-input bg-background px-3 text-sm"
            >
              <option>Graphic</option>
              <option>Typography</option>
              <option>Oversized</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="price">Price (₹)</Label>
              <Input
                id="price"
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
              />
            </div>
            <div>
              <Label htmlFor="mrp">MRP (₹)</Label>
              <Input
                id="mrp"
                type="number"
                value={form.mrp}
                onChange={(e) => setForm({ ...form, mrp: Number(e.target.value) })}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="img">Main image</Label>
            <Input
              id="img"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void pickImage(f, "image_url");
              }}
            />
            {form.image_url && (
              <img
                src={form.image_url}
                alt="Main product preview"
                className="mt-2 h-24 w-24 object-cover"
              />
            )}
          </div>
          <div>
            <Label htmlFor="himg">Hover image (optional)</Label>
            <Input
              id="himg"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void pickImage(f, "hover_image_url");
              }}
            />
            {form.hover_image_url && (
              <img
                src={form.hover_image_url}
                alt="Hover product preview"
                className="mt-2 h-24 w-24 object-cover"
              />
            )}
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="blurb">Blurb</Label>
            <Textarea
              id="blurb"
              value={form.blurb}
              onChange={(e) => setForm({ ...form, blurb: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="fabric">Fabric</Label>
            <Input
              id="fabric"
              value={form.fabric}
              onChange={(e) => setForm({ ...form, fabric: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="fit">Fit</Label>
            <Input
              id="fit"
              value={form.fit}
              onChange={(e) => setForm({ ...form, fit: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="print">Print</Label>
            <Input
              id="print"
              value={form.print}
              onChange={(e) => setForm({ ...form, print: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="care">Care</Label>
            <Input
              id="care"
              value={form.care}
              onChange={(e) => setForm({ ...form, care: e.target.value })}
            />
          </div>
        </div>

        <p className="label-caps mt-6">Stock per size</p>
        <div className="mt-2 grid grid-cols-5 gap-2">
          {SIZES.map((s) => (
            <div key={s}>
              <Label htmlFor={`stock-${s}`}>{s}</Label>
              <Input
                id={`stock-${s}`}
                type="number"
                value={stock[s]}
                onChange={(e) => setStock({ ...stock, [s]: Number(e.target.value) })}
              />
            </div>
          ))}
        </div>

        <Button variant="sale" className="mt-4" disabled={busy} onClick={() => void save()}>
          {busy ? "Working…" : "Publish product"}
        </Button>
      </Section>

      <Section title="Database products">
        <ul className="divide-y divide-border">
          {rows.map((row) => (
            <li key={row.slug} className="flex items-center justify-between gap-3 py-3">
              <span className="text-sm">
                {row.name} <span className="text-muted-foreground">/{row.slug}</span>
              </span>
              <Switch
                checked={row.active}
                onCheckedChange={() => void toggle(row.slug, row.active)}
              />
            </li>
          ))}
          {rows.length === 0 && (
            <li className="py-3 text-sm text-muted-foreground">No admin-added products yet.</li>
          )}
        </ul>
      </Section>
    </div>
  );
}

type OrderRow = {
  id: string;
  order_code: string;
  full_name: string;
  email: string;
  city: string;
  total: number;
  status: string;
  created_at: string;
};

const STATUSES = ["confirmed", "packed", "shipped", "delivered", "cancelled"];

function OrdersPanel() {
  const [rows, setRows] = useState<OrderRow[]>([]);

  const load = useCallback(async () => {
    const { data } = await supabase
      .from("orders")
      .select("id, order_code, full_name, email, city, total, status, created_at")
      .order("created_at", { ascending: false })
      .limit(100);
    setRows((data ?? []) as OrderRow[]);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const setStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("orders").update({ status }).eq("id", id);
    if (error) toast.error("Couldn't update status.");
    else {
      toast.success("Status updated.");
      void load();
    }
  };

  return (
    <Section title="Orders">
      <ul className="divide-y divide-border">
        {rows.map((row) => (
          <li key={row.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
            <div className="text-sm">
              <strong>{row.order_code}</strong> — {row.full_name}, {row.city}
              <div className="text-xs text-muted-foreground">
                {row.email} · ₹{row.total} · {new Date(row.created_at).toLocaleString()}
              </div>
            </div>
            <select
              value={row.status}
              onChange={(e) => void setStatus(row.id, e.target.value)}
              aria-label={`Status for order ${row.order_code}`}
              className="h-11 border border-input bg-background px-3 text-sm"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </li>
        ))}
        {rows.length === 0 && (
          <li className="py-3 text-sm text-muted-foreground">No orders yet.</li>
        )}
      </ul>
    </Section>
  );
}
