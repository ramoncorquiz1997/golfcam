// src/app/recordings/[slug]/page.tsx
import Link from "next/link";
import clubs from "@/data/clubs.json";
import { notFound } from "next/navigation";

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props) {
  const club = clubs.find(c => c.slug === params.slug);
  return {
    title: club ? `Grabaciones · ${club.name}` : "Grabaciones",
    description: club ? `Selecciona un hoyo en ${club.name}` : "Selecciona un hoyo",
  };
}

export default function ClubRecordingsPage({ params }: Props) {
  const club = clubs.find(c => c.slug === params.slug);
  if (!club) return notFound();

  // Hoyos 1..18 (ajusta si tu club tiene menos/más)
  const holes = Array.from({ length: 18 }, (_, i) => i + 1);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="max-w-6xl mx-auto px-4 py-10">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Grabaciones · {club.name}</h1>
          <p className="text-sm text-slate-500">{club.city}</p>
        </div>

        <h2 className="text-xl font-semibold mb-4">Selecciona un hoyo</h2>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {holes.map((h) => (
            <Link
              key={h}
              href={`/recordings/${params.slug}/${h}`}
              className="group rounded-xl border border-gray-200 bg-white shadow-sm p-4
                         transition hover:shadow-lg hover:border-green-500 hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-slate-500">Hoyo</div>
                  <div className="text-xl font-semibold">#{h}</div>
                </div>
                <div className="text-green-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition">
                  Ver →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}