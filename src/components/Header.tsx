import { Link } from "@tanstack/react-router";
import { Menu, ShoppingBag, User, X } from "lucide-react";
import { useState } from "react";
import gorLogo from "@/assets/gor-chrome-logo.png.asset.json";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/auth";
import { useSite } from "@/lib/site";

const nav = [
  { to: "/shop", label: "Shop" },
  { to: "/about", label: "About" },
  { to: "/track", label: "Track order" },
] as const;

export function Header() {
  const { count, open } = useCart();
  const { user, isAdmin } = useAuth();
  const { settings } = useSite();
  const [menu, setMenu] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <button
          className="flex h-11 w-11 items-center justify-center md:hidden"
          aria-label="Open menu"
          onClick={() => setMenu((v) => !v)}
        >
          {menu ? <Menu className="hidden" /> : null}
          {menu ? <X /> : <Menu />}
        </button>

        <Link
          to="/"
          className="flex items-center bg-ink px-3 py-1"
          aria-label={`${settings.brand_name} home`}
        >
          <img
            src={settings.logo_url ?? gorLogo.url}
            alt={settings.brand_name}
            className="h-9 w-auto object-contain sm:h-12"
          />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="label-caps transition-colors hover:text-primary"
              activeProps={{ className: "text-primary" }}
            >
              {item.label}
            </Link>
          ))}
          {isAdmin && (
            <Link to="/admin" className="label-caps text-primary">
              Admin
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="sale" size="sm" className="hidden sm:inline-flex" asChild>
            <Link to="/shop">Shop the sale</Link>
          </Button>
          <Link
            to={user ? "/profile" : "/auth"}
            aria-label={user ? "Your account" : "Sign in"}
            className="flex h-11 w-11 items-center justify-center"
          >
            <User />
          </Link>
          <button
            onClick={open}
            aria-label={`Cart, ${count} items`}
            className="relative flex h-11 w-11 items-center justify-center"
          >
            <ShoppingBag />
            {count > 0 && (
              <span className="absolute right-1 top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[0.625rem] font-bold text-primary-foreground">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>

      {menu && (
        <nav className="border-t border-border bg-background px-4 pb-4 md:hidden">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setMenu(false)}
              className="label-caps flex h-12 items-center border-b border-border"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
