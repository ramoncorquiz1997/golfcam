// src/app/recordings/[slug]/[date]/page.tsx
"use client";

import { useRouter } from "next/navigation";
// ❌ notFound solo sirve en server components
// import { notFound } from "next/navigation";
import clubs from "@/data/clubs.json";

type Params = { slug: string; date: string };

export default function ClubDateHolesPage({ params }: { params: Params }) {
  const { slug, date } = params;
  const router = useRouter();

  const club = clubs.find(c => c.slug === slug);
  if (!club) {
    router.replace("/recordings");
    return null;
  }

  const holes = Array.from({ length: 18 }, (_, i) => i + 1);

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const hole = e.target.value;
    if (hole) router.push(`/recordings/${slug}/${date}/${hole}`);
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="max-w-2xl mx-auto px-4 py-10 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{club.name}</h1>
          <p className="text-sm text-muted-foreground">
            {club.city} • {date}
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-card-foreground mb-3">Selecciona un hoyo</h2>

          <select
            onChange={handleChange}
            defaultValue=""
            className="w-full rounded-lg border border-input bg-background text-foreground
                       px-3 py-2 text-sm shadow-sm
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
                       ring-offset-2 ring-offset-background"
          >
            <option value="" disabled>-- Elige un hoyo --</option>
            {holes.map(n => (
              <option key={n} value={n}>Hoyo {n}</option>
            ))}
          </select>
        </div>
      </section>
    </main>
  );
}