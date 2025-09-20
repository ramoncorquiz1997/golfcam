// src/app/recordings/[slug]/[date]/[hole]/page.tsx
"use client";

import clubs from "@/data/clubs.json";
import { notFound, useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { bucketVideosToSlots, type Slot } from "@/lib/timeSlots";
import { getVideosForHoleByDate, type Clip } from "@/lib/getData";
import PreRollAd from "@/components/PreRollAd";

export default function HoleByDatePage() {
  const { slug, date, hole } = useParams() as { slug: string; date: string; hole: string };
  const holeNum = Number(hole);

  const club = useMemo(() => clubs.find(c => c.slug === slug), [slug]);
  if (!club || !Number.isFinite(holeNum) || holeNum < 1 || holeNum > 18) return notFound();

  const [adDone, setAdDone] = useState(false); // 👈 anuncio debe verse siempre
  const adSrc = `/ads/${slug}/${holeNum}.mp4`;

  const [slots, setSlots] = useState<Slot<Clip>[]>([]);
  const [currentSlotKey, setCurrentSlotKey] = useState<string | null>(null);
  const [currentVideo, setCurrentVideo] = useState<Clip | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      const clips = await getVideosForHoleByDate(slug, holeNum, date);
      const s = bucketVideosToSlots<Clip>(clips, { stepMin: 10, startHour: 5, endHour: 18 });

      if (!alive) return;
      setSlots(s);
      if (s.length && s[0].items.length) {
        setCurrentSlotKey(s[0].key);
        setCurrentVideo(s[0].items[0]);
      } else {
        setCurrentSlotKey(null);
        setCurrentVideo(null);
      }
      setLoading(false);
    })();
    return () => { alive = false; };
  }, [slug, holeNum, date]);

  const currentSlot = slots.find(x => x.key === currentSlotKey) || null;

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Overlay del patrocinador (bloquea todo hasta cerrar/saltar) */}
      {!adDone && (
        <PreRollAd
          src={adSrc}
          onDone={() => setAdDone(true)}
          skippableLastSeconds={40}
        />
      )}

      <section className="max-w-6xl mx-auto px-4 py-10 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{club.name} — Hoyo #{holeNum}</h1>
          <p className="text-sm text-slate-500">{club.city} • {date}</p>
        </div>

        {/* Slots (10 min) */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Horarios con video</h2>
          {loading ? (
            <div className="text-slate-500">Cargando…</div>
          ) : slots.length === 0 ? (
            <div className="text-slate-500">No hay videos para este hoyo en esta fecha.</div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {slots.map(slot => (
                <button
                  key={slot.key}
                  onClick={() => {
                    setCurrentSlotKey(slot.key);
                    setCurrentVideo(slot.items[0] ?? null);
                  }}
                  className={`px-3 py-1.5 rounded-lg border text-sm transition
                    ${currentSlotKey === slot.key
                      ? "border-emerald-600 bg-emerald-50"
                      : "border-gray-200 bg-white hover:border-emerald-500 hover:shadow-sm"
                    }`}
                >
                  {slot.label} ({slot.items.length})
                </button>
              ))}
            </div>
          )}
        </section>

        {/* Player + lista de clips del slot */}
        <section className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-2">
            <div className="text-sm text-slate-500">
              {currentSlot ? `Reproduciendo: ${currentSlot.label}` : "Selecciona un horario"}
            </div>
            <div className="aspect-video w-full rounded-xl border border-gray-200 bg-black/80 grid place-items-center text-white/60">
              {currentVideo ? (
                <video
                  key={currentVideo.url}
                  src={currentVideo.url}
                  controls
                  className="w-full h-full"
                />
              ) : (
                "Sin selección"
              )}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold">Clips en este horario</h3>
            {currentSlot && currentSlot.items.length > 0 ? (
              <ul className="space-y-2">
                {currentSlot.items.map((clip) => (
                  <li key={clip.url}>
                    <button
                      onClick={() => setCurrentVideo(clip)}
                      className={`w-full flex items-center gap-3 p-2 rounded-lg border text-left transition
                        ${currentVideo?.url === clip.url
                          ? "border-emerald-600 bg-emerald-50"
                          : "border-gray-200 bg-white hover:border-emerald-500"
                        }`}
                    >
                      {clip.thumb && (
                        <img src={clip.thumb} alt="" className="w-16 h-10 object-cover rounded" />
                      )}
                      <div className="text-sm">
                        <div className="font-medium">{clip.label ?? "Clip"}</div>
                        <div className="text-slate-500">{clip.ts}</div>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-slate-500 text-sm">No hay clips en este horario.</div>
            )}
          </div>
        </section>
      </section>
    </main>
  );
}