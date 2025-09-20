// src/app/recordings/[slug]/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import clubs from "@/data/clubs.json";
import { useMemo, useState } from "react";

export default function ClubDatePickerPage() {
  const { slug } = useParams() as { slug: string };
  const router = useRouter();

  const club = useMemo(() => clubs.find(c => c.slug === slug), [slug]);
  if (!club) {
    // notFound() no funciona en client; redirige o muestra fallback
    router.replace("/recordings");
    return null;
  }

  const [date, setDate] = useState<string>(() => {
    const d = new Date();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${d.getFullYear()}-${mm}-${dd}`;
  });

  const goNext = () => {
    if (!date) return;
    router.push(`/recordings/${slug}/${date}`);
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="max-w-6xl mx-auto px-4 py-10 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{club.name}</h1>
          <p className="text-sm text-muted-foreground">{club.city}</p>
        </div>

        {/* 👇 Usa tokens del tema en vez de bg-white/border-gray */}
        <div className="rounded-xl border border-border bg-card p-6 max-w-md shadow-sm">
          <h2 className="text-lg font-semibold mb-3 text-card-foreground">Elige una fecha</h2>

          <div className="flex items-center gap-3">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="px-3 py-2 rounded-lg bg-background text-foreground
                         border border-input placeholder:text-muted-foreground
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
                         ring-offset-2 ring-offset-background"
            />
            <button
              onClick={goNext}
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground
                         hover:opacity-90 transition shadow-sm
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
                         ring-offset-2 ring-offset-background"
            >
              Continuar
            </button>
          </div>

          <p className="text-xs text-muted-foreground mt-3">
            (Después elegiremos el hoyo y los horarios disponibles de esa fecha)
          </p>
        </div>
      </section>
    </main>
  );
}