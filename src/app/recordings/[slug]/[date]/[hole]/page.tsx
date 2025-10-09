// src/app/recordings/[slug]/[date]/[hole]/page.tsx
"use client";

import Image from "next/image";
import clubs from "@/data/clubs.json";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { bucketVideosToSlots, type Slot } from "@/lib/timeSlots";
import { getVideosForHoleByDate, type Clip } from "@/lib/getData";
import PreRollAd from "@/components/PreRollAd";

function toAbsoluteUrl(u?: string | null): string {
  if (!u) return "";
  if (/^https?:\/\//i.test(u)) return u;
  if (typeof window !== "undefined") {
    const leading = u.startsWith("/") ? "" : "/";
    return `${window.location.origin}${leading}${u}`;
  }
  return u;
}

function fileNameFromUrl(u: string): string {
  try {
    const p = new URL(u, "http://dummy/");
    const parts = p.pathname.split("/");
    return parts[parts.length - 1] || "video.mp4";
  } catch {
    const clean = u.split("?")[0].split("#")[0];
    const parts = clean.split("/");
    return parts[parts.length - 1] || "video.mp4";
  }
}

export default function HoleByDatePage() {
  const { slug, date, hole } = useParams() as { slug: string; date: string; hole: string };
  const router = useRouter();
  const holeNum = Number(hole);

  const club = useMemo(() => clubs.find((c) => c.slug === slug), [slug]);

  // Guardas
  useEffect(() => {
    if (!club || !Number.isFinite(holeNum) || holeNum < 1 || holeNum > 18) {
      router.replace("/recordings");
    }
  }, [club, holeNum, router]);

  // --- Pre-roll ---
  const adSrcRel = `/ads/${slug}/${holeNum}.mp4`;
  const adSrcAbs = toAbsoluteUrl(adSrcRel);
  const [adDone, setAdDone] = useState<boolean>(false);

  // --- Datos de clips ---
  const [slots, setSlots] = useState<Slot<Clip>[]>([]);
  const [currentSlotKey, setCurrentSlotKey] = useState<string | null>(null);
  const [currentVideo, setCurrentVideo] = useState<Clip | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      const clips = await getVideosForHoleByDate(slug, holeNum, date);
      const s = bucketVideosToSlots<Clip>(clips, { stepMin: 10, startHour: 0, endHour: 24 });

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

  const currentSlot = useMemo(
    () => slots.find((x) => x.key === currentSlotKey) || null,
    [slots, currentSlotKey]
  );

  // URL final (absoluta) del MP4
  const fileUrl = useMemo(() => toAbsoluteUrl(currentVideo?.url), [currentVideo?.url]);

  // Cache-buster (se regenera cuando cambia el clip)
  const [cacheKey, setCacheKey] = useState<string>("");
  useEffect(() => {
    setCacheKey(currentVideo?.url ? String(Date.now()) : "");
  }, [currentVideo?.url]);

  const fileUrlWithBust = useMemo(
    () => (fileUrl ? `${fileUrl}${fileUrl.includes("?") ? "&" : "?"}v=${cacheKey}` : ""),
    [fileUrl, cacheKey]
  );

  const downloadFileName = useMemo(() => fileNameFromUrl(fileUrl), [fileUrl]);

  const onPickSlot = useCallback(
    (key: string) => {
      setCurrentSlotKey(key);
      const s = slots.find((ss) => ss.key === key);
      setCurrentVideo(s?.items?.[0] ?? null);
    },
    [slots]
  );

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Overlay del patrocinador */}
      {!adDone && (
        <PreRollAd
          key={adSrcAbs}             // si cambias de hoyo/club forza a reiniciar ad
          src={adSrcAbs}
          onDone={() => setAdDone(true)}
          skippableLastSeconds={10}  // <<< SOLO ESTO: podrás saltar en los últimos 10s
        />
      )}

      <section className="max-w-6xl mx-auto px-4 py-10 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{club?.name} — Hoyo #{holeNum}</h1>
          <p className="text-sm text-muted-foreground">
            {club?.city} • {date}
          </p>
        </div>

        {/* Slots (10 min) */}
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
                    onClick={() => onPickSlot(slot.key)}
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

            <div className="aspect-video w-full rounded-xl border border-border bg-black/80 grid place-items-center text-white/60">
              {currentVideo && fileUrlWithBust ? (
                <video
                  key={fileUrlWithBust}
                  src={fileUrlWithBust}
                  controls
                  playsInline
                  preload="metadata"
                  className="w-full h-full rounded-xl"
                  onError={(e) => {
                    // eslint-disable-next-line no-console
                    console.error("Video error. URL:", fileUrlWithBust, e);
                    alert("No se pudo reproducir el video. Reintenta o verifica la URL en consola.");
                  }}
                >
                  <source src={fileUrlWithBust} type="video/mp4" />
                </video>
              ) : (
                "Sin selección"
              )}
            </div>

            {/* Acción: descargar clip seleccionado */}
            <div className="flex items-center gap-3">
              <a
                href={fileUrlWithBust || "#"}
                download={downloadFileName}
                target="_blank"
                rel="noopener noreferrer"
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