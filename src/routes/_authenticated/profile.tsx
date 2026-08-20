import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { isProfileComplete, useAuth } from "@/lib/auth";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({
    meta: [
      { title: "Your profile — Gor Fashion House" },
      {
        name: "description",
        content: "Manage your Gor Fashion House shipping details and account.",
      },
      { property: "og:title", content: "Your profile — Gor Fashion House" },
      { property: "og:description", content: "Manage your shipping details and account." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { user, profile, isAdmin, refresh, signOut } = useAuth();
  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    address: "",
    city: "",
    pin: "",
  });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (profile) {
      setForm({
        full_name: profile.full_name ?? "",
        phone: profile.phone ?? "",
        address: profile.address ?? "",
        city: profile.city ?? "",
        pin: profile.pin ?? "",
      });
    }
  }, [profile]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setBusy(true);
    const { error } = await supabase
      .from("profiles")
      .upsert({ id: user.id, ...form })
      .select("id")
      .maybeSingle();
    setBusy(false);
    if (error) {
      toast.error("Couldn't save your profile. Try again.");
      return;
    }
    await refresh();
    toast.success("Profile saved. You're ready to check out.");
  };

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  return (
    <div className="mx-auto max-w-xl px-4 py-14">
      <h1 className="display-lg">Your profile</h1>
      <p className="mt-2 text-sm text-muted-foreground">{user?.email}</p>
      {!isProfileComplete(profile) && (
        <p className="label-caps mt-4 w-fit bg-scarcity px-2 py-1 text-scarcity-foreground">
          Complete every field to unlock checkout
        </p>
      )}

      <form className="mt-6 grid gap-3 sm:grid-cols-2" onSubmit={save}>
        <div className="sm:col-span-2">
          <Label htmlFor="full_name">Full name</Label>
          <Input
            id="full_name"
            value={form.full_name}
            onChange={set("full_name")}
            className="mt-1 h-11"
            required
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            type="tel"
            value={form.phone}
            onChange={set("phone")}
            className="mt-1 h-11"
            required
          />
        </div>
        <div>
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            value={form.city}
            onChange={set("city")}
            className="mt-1 h-11"
            required
          />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            value={form.address}
            onChange={set("address")}
            className="mt-1 h-11"
            required
          />
        </div>
        <div>
          <Label htmlFor="pin">PIN code</Label>
          <Input
            id="pin"
            inputMode="numeric"
            value={form.pin}
            onChange={set("pin")}
            className="mt-1 h-11"
            required
          />
        </div>
        <div className="sm:col-span-2 flex flex-wrap gap-2">
          <Button variant="sale" size="lg" type="submit" disabled={busy}>
            {busy ? "Saving…" : "Save profile"}
          </Button>
          <Button variant="outline" size="lg" type="button" asChild>
            <Link to="/checkout">Go to checkout</Link>
          </Button>
          {isAdmin && (
            <Button variant="ink" size="lg" type="button" asChild>
              <Link to="/admin">Admin dashboard</Link>
            </Button>
          )}
          <Button variant="ghost" size="lg" type="button" onClick={() => void signOut()}>
            Sign out
          </Button>
        </div>
      </form>
    </div>
  );
}
