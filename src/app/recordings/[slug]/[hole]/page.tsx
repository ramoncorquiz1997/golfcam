// src/app/recordings/[slug]/[hole]/page.tsx
import clubs from "@/data/clubs.json";
import { notFound } from "next/navigation";

type Props = { params: { slug: string; hole: string } };

export async function generateMetadata({ params }: Props) {
  const club = clubs.find(c => c.slug === params.slug);
  const holeNum = Number(params.hole);
  return {
    title: club ? `Hoyo ${holeNum} · ${club.name}` : `Hoyo ${holeNum}`,
    description: club ? `Revisar grabaciones del Hoyo ${holeNum} en ${club.name}` : undefined,
  };
}

export default function HoleRecordingsPage({ params }: Props) {
  const club = clubs.find(c => c.slug === params.slug);
  if (!club) return notFound();

  const holeNum = Number(params.hole);
  if (!Number.isFinite(holeNum) || holeNum < 1 || holeNum > 18) return notFound();

  // Placeholder: luego conectamos horarios (slots) / video (HLS)
  const sponsor = null; // ej: { name: "Patrocinador", banner: "/sponsors/foo.jpg", url: "#" }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="max-w-6xl mx-auto px-4 py-10 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{club.name} — Hoyo #{holeNum}</h1>
          <p className="text-sm text-slate-500">{club.city}</p>
        </div>

        {/* Sponsor (opcional) */}
        {sponsor ? (
          <a
            href={sponsor.url}
            className="block rounded-xl overflow-hidden border border-green-500/30 bg-green-50 dark:bg-green-950/20"
          >
            <img
              src={sponsor.banner}
              alt={sponsor.name}
              className="w-full max-h-40 object-cover"
            />
          </a>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-300/60 p-4 text-slate-500">
            Zona de patrocinador (pendiente)
          </div>
        )}

        {/* Selector de horarios (placeholder) */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Selecciona horario</h2>
          <div className="flex flex-wrap gap-2">
            {/* Aquí luego pintamos los slots reales */}
            {["08:00", "08:10", "08:20", "08:30", "08:40", "08:50"].map(t => (
              <button
                key={t}
                className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:border-green-500 hover:shadow-sm transition"
              >
                {t}
              </button>
            ))}
          </div>
        </section>

        {/* Player (placeholder) */}
        <section className="space-y-2">
          <div className="text-sm text-slate-500">Reproduciendo: —</div>
          <div className="aspect-video w-full rounded-xl border border-gray-200 bg-black/80 grid place-items-center text-white/60">
            Player HLS aquí (pendiente)
          </div>
        </section>
      </section>
    </main>
  );
}