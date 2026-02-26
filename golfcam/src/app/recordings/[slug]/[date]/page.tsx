// src/app/recordings/[slug]/[date]/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import clubs from "@/data/clubs.json";
import CourtCard from "@/components/CourtCard";

type Hole = { slug: string; name: string; image?: string; subtitle?: string };
type Club = { slug: string; name: string; city: string; image?: string; holes?: Hole[]; courts?: Hole[] };

export default function ClubDateHolesPage() {
  const { slug, date } = useParams() as { slug: string; date: string };
  const router = useRouter();
  const club = (clubs as Club[]).find((c) => c.slug === slug);

  if (!club) {
    router.replace("/recordings");
    return null;
  }

  const holes = club.holes ?? club.courts ?? [];

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="max-w-4xl mx-auto px-4 py-10 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{club.name}</h1>
          <p className="text-sm text-muted-foreground">{club.city} - {date}</p>
        </div>

        {holes.length === 0 ? (
          <p className="text-sm text-muted-foreground">Este club no tiene hoyos configurados.</p>
        ) : (
          <>
            <h2 className="text-lg font-semibold">Selecciona un hoyo</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {holes.map((hole) => (
                <CourtCard
                  key={hole.slug}
                  name={hole.name}
                  image={hole.image}
                  subtitle={club.name}
                  href={`/recordings/${slug}/${date}/${hole.slug}`}
                />
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
}
