import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import { SIZES, formatINR, totalStock, type Product } from "@/lib/products";
import { cn } from "@/lib/utils";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { add } = useCart();
  const [hover, setHover] = useState(false);
  const left = totalStock(product);
  const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);
  const firstInStock = SIZES.find((s) => product.stock[s] > 0);

  return (
    <article
      className="group animate-rise"
      style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Link
        to="/product/$slug"
        params={{ slug: product.slug }}
        className="block overflow-hidden bg-muted"
      >
        <div className="relative aspect-square">
          <img
            src={product.image}
            alt={product.name}
            width={1024}
            height={1024}
            loading="lazy"
            className={cn(
              "absolute inset-0 h-full w-full object-cover transition-[transform,opacity] duration-200 ease-out",
              hover ? "scale-[1.03] opacity-0" : "opacity-100",
            )}
          />
          <img
            src={product.hoverImage}
            alt={`${product.name} detail`}
            width={1024}
            height={1024}
            loading="lazy"
            className={cn(
              "absolute inset-0 h-full w-full object-cover transition-[transform,opacity] duration-200 ease-out",
              hover ? "scale-[1.03] opacity-100" : "opacity-0",
            )}
          />
          <div className="absolute left-2 top-2 flex flex-col items-start gap-1">
            {product.bestseller && (
              <span className="label-caps bg-scarcity px-2 py-1 text-scarcity-foreground">
                🔥 Bestseller
              </span>
            )}
            {left > 0 && left <= 8 && (
              <span className="label-caps bg-scarcity px-2 py-1 text-scarcity-foreground">
                Only {left} left
              </span>
            )}
            {left === 0 && (
              <span className="label-caps bg-ink px-2 py-1 text-ink-foreground">Sold out</span>
            )}
          </div>
        </div>
      </Link>

      <div className="pt-3">
        <Link to="/product/$slug" params={{ slug: product.slug }}>
          <h3 className="text-sm font-bold tracking-tight">{product.name}</h3>
        </Link>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="font-display text-base text-primary">{formatINR(product.price)}</span>
          <span className="text-sm text-muted-foreground line-through">
            {formatINR(product.mrp)}
          </span>
          <span className="label-caps text-primary">-{discount}%</span>
        </div>
        <Button
          variant="sale"
          size="sm"
          className="mt-3 w-full md:opacity-0 md:transition-opacity md:duration-200 md:group-hover:opacity-100 md:group-focus-within:opacity-100"
          disabled={!firstInStock}
          onClick={() => firstInStock && add(product, firstInStock)}
        >
          {firstInStock ? "Quick add" : "Sold out"}
        </Button>
      </div>
    </article>
  );
}
