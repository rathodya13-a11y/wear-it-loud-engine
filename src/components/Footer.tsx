import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Countdown } from "@/components/Countdown";
import { SALE_ENDS_AT } from "@/lib/products";

export function Footer() {
  return (
    <>
      <section className="bg-ink px-4 py-14 text-ink-foreground">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 text-center">
          <h2 className="display-lg">
            Drop ends soon.
            <br />
            Don't wait.
          </h2>
          <Countdown endsAt={SALE_ENDS_AT} size="lg" />
          <Button variant="sale" size="lg" asChild>
            <Link to="/shop">Grab yours before it's gone</Link>
          </Button>
        </div>
      </section>

      <footer className="border-t border-border px-4 py-10">
        <div className="mx-auto grid max-w-7xl gap-8 sm:grid-cols-3">
          <div>
            <p className="font-display text-lg">
              GOR<span className="text-primary">.</span>
            </p>
            <p className="mt-2 max-w-xs text-sm text-muted-foreground">
              Gor Fashion House isn't for blending in. Every print's a statement.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <p className="label-caps">Shop</p>
            <Link to="/shop" className="text-sm text-muted-foreground hover:text-primary">
              All tees
            </Link>
            <Link to="/about" className="text-sm text-muted-foreground hover:text-primary">
              About us
            </Link>
            <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary">
              Track order
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            <p className="label-caps">Tag us</p>
            <p className="text-sm text-muted-foreground">@gorfashionhouse</p>
            <p className="text-sm text-muted-foreground">hello@gorfashionhouse.in</p>
          </div>
        </div>
        <p className="mx-auto mt-8 max-w-7xl text-xs text-muted-foreground">
          © {new Date().getFullYear()} Gor Fashion House. All rights reserved.
        </p>
      </footer>
    </>
  );
}
