"use client";

import Image from "next/image";
import clubs from "@/data/clubs.json";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { bucketVideosToSlots, type Slot } from "@/lib/timeSlots";
import { getVideosForHoleByDate, type Clip } from "@/lib/getData";
import PreRollAd from "@/components/PreRollAd";

export default function HoleByDatePage() {
  const { slug, date, hole } = useParams() as { slug: string; date: string; hole: string };
  const router = useRouter();
  const holeNum = Number(hole);

  const club = useMemo(() => clubs.find((c) => c.slug === slug), [slug]);

  // Guardas (si algo no cuadra, regresa al índice)
  useEffect(() => {
    if (!club || !Number.isFinite(holeNum) || holeNum < 1 || holeNum > 18) {
      router.replace("/recordings");
    }
  }, [club, holeNum, router]);

  const [adDone, setAdDone] = useState(false);
  const adSrc = `/ads/${slug}/${holeNum}.mp4`;

  const [slots, setSlots] = useState<Slot<Clip>[]>([]);
  const [currentSlotKey, setCurrentSlotKey] = useState<string | null>(null);
  const [currentVideo, setCurrentVideo] = useState<Clip | null>(null);
  const [loading, setLoading] = useState(true);

  // Video ref para manejar play tras interacción si el navegador lo exige
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [needsTap, setNeedsTap] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      // Usamos slots de 60min para agrupar por hora del día (tú lo tenías así).
      const clips = await getVideosForHoleByDate(slug, holeNum, date);
      const s = bucketVideosToSlots<Clip>(clips, { stepMin: 60, startHour: 0, endHour: 24 });

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
    return () => {
      alive = false;
    };
  }, [slug, holeNum, date]);

  const currentSlot = slots.find((x) => x.key === currentSlotKey) || null;

  // Cada vez que cambia el video, intentamos reproducir y si falla pedimos interacción
  useEffect(() => {
    setNeedsTap(false);
    const el = videoRef.current;
    if (!el) return;
    // Forzamos “load()” para refrescar metadata y rangos
    try {
      el.load();
    } catch {}
    const tryPlay = async () => {
      try {
        await el.play();
      } catch {
        // Algunos navegadores requieren interacción del usuario
        setNeedsTap(true);
      }
    };
    // Autoplay sólo si no hay overlay de anuncio
    if (adDone && currentVideo) {
      tryPlay();
    }
  }, [currentVideo, adDone]);

  const downloadUrl = currentVideo?.url ?? "";

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Overlay del patrocinador (bloquea todo hasta cerrar/saltar) */}
      {!adDone && (
        <PreRollAd src={adSrc} onDone={() => setAdDone(true)} skippableLastSeconds={50} />
      )}

      <section className="max-w-6xl mx-auto px-4 py-10 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{club?.name} — Hoyo #{holeNum}</h1>
          <p className="text-sm text-muted-foreground">
            {club?.city} • {date}
          </p>
        </div>

        {/* Slots (agrupación) */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Horarios con video</h2>
          {loading ? (
            <div className="text-muted-foreground">Cargando…</div>
          ) : slots.length === 0 ? (
            <div className="text-muted-foreground">No hay videos para este hoyo en esta fecha.</div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {slots.map((slot) => {
                const active = currentSlotKey === slot.key;
                return (
                  <button
                    key={slot.key}
                    onClick={() => {
                      setCurrentSlotKey(slot.key);
                      setCurrentVideo(slot.items[0] ?? null);
                    }}
                    className={[
                      "px-3 py-1.5 rounded-lg border text-sm transition",
                      active
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-card hover:ring-1 hover:ring-primary/40",
                    ].join(" ")}
                  >
                    {slot.label} ({slot.items.length})
                  </button>
                );
              })}
            </div>
          )}
        </section>

        {/* Player + lista de clips del slot */}
        <section className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-3">
            <div className="text-sm text-muted-foreground">
              {currentSlot ? `Reproduciendo: ${currentSlot.label}` : "Selecciona un horario"}
            </div>

            <div className="relative aspect-video w-full rounded-xl border border-border bg-black/80 grid place-items-center text-white/60">
              {currentVideo ? (
                <>
                  <video
                    ref={videoRef}
                    key={currentVideo.url}
                    controls
                    playsInline
                    preload="metadata"
                    className="w-full h-full rounded-xl"
                    onError={(e) => {
                      const el = e.currentTarget;
                      // Log visible en consola para diagnosticar si llega a fallar el decode
                      // (por ejemplo si un clip vino en HEVC/10bit sin transcodificar)
                      console.error("Error reproduciendo video:", {
                        src: currentVideo.url,
                        error:
                          (el.error && (el.error as any).message) ||
                          el.error ||
                          "unknown",
                      });
                    }}
                  >
                    <source src={currentVideo.url} type="video/mp4" />
                    Tu navegador no puede reproducir este video.
                  </video>

                  {needsTap && (
                    <button
                      onClick={async () => {
                        setNeedsTap(false);
                        try {
                          await videoRef.current?.play();
                        } catch {
                          setNeedsTap(true);
                        }
                      }}
                      className="absolute inset-0 m-auto h-12 w-44 rounded-lg bg-white/10 text-white border border-white/20 backdrop-blur-sm"
                    >
                      Tocar para reproducir
                    </button>
                  )}
                </>
              ) : (
                "Sin selección"
              )}
            </div>

            {/* Acción: descargar clip seleccionado */}
            <div className="flex items-center gap-3">
              <a
                href={downloadUrl || "#"}
                download
                className={[
                  "inline-flex items-center justify-center px-4 py-2 rounded-lg",
                  "bg-primary text-primary-foreground hover:opacity-90 transition",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ring-offset-2 ring-offset-background",
                  !currentVideo && "pointer-events-none opacity-50",
                ].join(" ")}
              >
                Descargar video
              </a>
              {currentVideo?.label && (
                <span className="text-xs text-muted-foreground">{currentVideo.label}</span>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold">Clips en este horario</h3>
            {currentSlot && currentSlot.items.length > 0 ? (
              <ul className="space-y-2">
                {currentSlot.items.map((clip) => {
                  const active = currentVideo?.url === clip.url;
                  return (
                    <li key={clip.url}>
                      <button
                        onClick={() => setCurrentVideo(clip)}
                        className={[
                          "w-full flex items-center gap-3 p-2 rounded-lg border text-left transition bg-card",
                          active
                            ? "border-primary bg-primary/10"
                            : "border-border hover:ring-1 hover:ring-primary/40",
                        ].join(" ")}
                      >
                        {clip.thumb && (
                          <Image
                            src={clip.thumb}
                            alt=""
                            width={64}
                            height={40}
                            className="object-cover rounded"
                          />
                        )}
                        <div className="text-sm">
                          <div className="font-medium">{clip.label ?? "Clip"}</div>
                          <div className="text-muted-foreground">{clip.ts}</div>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="text-muted-foreground text-sm">No hay clips en este horario.</div>
            )}
          </div>
        </section>
      </section>
    </main>
  );
}