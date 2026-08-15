import { createFileRoute, Link } from "@tanstack/react-router";
import hero from "@/assets/hero.jpg";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Gor Fashion House" },
      {
        name: "description",
        content:
          "Gor Fashion House isn't for blending in. Heavyweight cotton, loud prints, made in small drops.",
      },
      { property: "og:title", content: "About — Gor Fashion House" },
      {
        property: "og:description",
        content: "Heavyweight cotton, loud prints, small drops. Wear it loud.",
      },
    ],
  }),
  component: About,
});

function About() {
  return (
    <>
      <section className="relative bg-ink px-4 py-20 text-ink-foreground">
        <img
          src={hero}
          alt=""
          width={1600}
          height={1200}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover opacity-30"
        />
        <div className="relative mx-auto max-w-3xl">
          <h1 className="display-xl">Wear it loud.</h1>
          <p className="mt-4 max-w-xl text-lg text-ink-foreground/85">
            Gor Fashion House isn't for blending in. Every print's a statement.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-14">
        <div className="grid gap-8">
          {[
            {
              h: "Small drops. Real scarcity.",
              p: "We print in limited runs. When a size sells out, it's out — we don't fake counters to rush you.",
            },
            {
              h: "Heavy cotton only",
              p: "200–260 GSM combed cotton, bio-washed, pre-shrunk. No see-through, no shrink surprises.",
            },
            {
              h: "Prints built to survive",
              p: "High-density DTG and screen printing that takes a beating in the wash and stays loud.",
            },
          ].map((b) => (
            <div key={b.h}>
              <h2 className="display-sm">{b.h}</h2>
              <p className="mt-2 text-muted-foreground">{b.p}</p>
            </div>
          ))}
        </div>
        <Button variant="sale" size="lg" className="mt-10" asChild>
          <Link to="/shop">Shop the drop</Link>
        </Button>
      </section>
    </>
  );
}
