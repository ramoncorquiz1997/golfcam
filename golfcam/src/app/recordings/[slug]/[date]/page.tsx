// src/app/recordings/[slug]/[date]/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import clubs from "@/data/clubs.json";
import CourtCard from "@/components/CourtCard";

type Court = { slug: string; name: string; image?: string; subtitle?: string };
type Club  = { slug: string; name: string; city: string; image?: string; courts: Court[] };

export default function ClubDateCourtsPage() {
  const { slug, date } = useParams() as { slug: string; date: string };
  const router = useRouter();
  const club = (clubs as Club[]).find((c) => c.slug === slug);

  if (!club) {
    router.replace("/recordings");
    return null;
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="max-w-4xl mx-auto px-4 py-10 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{club.name}</h1>
          <p className="text-sm text-muted-foreground">{club.city} • {date}</p>
        </div>

        {(!club.courts || club.courts.length === 0) ? (
          <p className="text-sm text-muted-foreground">Este club no tiene canchas configuradas.</p>
        ) : (
          <>
            <h2 className="text-lg font-semibold">Selecciona una cancha</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {club.courts.map((court) => (
                <CourtCard
                  key={court.slug}
                  name={court.name}
                  image={court.image}
                  subtitle={club.name}
                  href={`/recordings/${slug}/${date}/${court.slug}`}
                />
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
}