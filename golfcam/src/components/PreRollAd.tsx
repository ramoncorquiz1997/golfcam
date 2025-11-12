"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  src: string; // ruta completa del video: /ads/<slug>/<hole|court>.mp4
  onDone: () => void; // callback para cerrar overlay
  skippableAfter?: number; // segundos tras los cuales se puede saltar (default 10)
  label?: string; // texto opcional: “Anuncio del patrocinador”, “Patrocinio de la cancha”, etc.
};

export default function PreRollAd({
  src,
  onDone,
  skippableAfter = 10,
  label = "Anuncio del patrocinador",
}: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [canSkip, setCanSkip] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [error, setError] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    let rafId = 0;

    const tick = () => {
      try {
        setElapsed(v.currentTime || 0);
        if (!canSkip && v.currentTime >= skippableAfter) {
          setCanSkip(true);
        }
      } finally {
        rafId = requestAnimationFrame(tick);
      }
    };

    const tryAutoplay = () => {
      v.play().catch(() => {});
    };

    const onPlay = () => {
      if (!rafId) rafId = requestAnimationFrame(tick);
    };
    const onPause = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = 0;
    };
    const onEnded = () => {
      setCanSkip(true);
      onDone();
    };
    const onErr = () => {
      console.warn("[PreRollAd] Error loading ad:", src);
      setError(true);
      onDone(); // si falla el anuncio, no bloqueamos
    };

    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);
    v.addEventListener("ended", onEnded);
    v.addEventListener("error", onErr);
    v.addEventListener("loadedmetadata", tryAutoplay);
    tryAutoplay();

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onPause);
      v.removeEventListener("ended", onEnded);
      v.removeEventListener("error", onErr);
      v.removeEventListener("loadedmetadata", tryAutoplay);
    };
  }, [onDone, skippableAfter, canSkip, src]);

  if (error) return null;

  return (
    <div className="fixed inset-0 z-[1000] bg-black/90 backdrop-blur-sm grid place-items-center">
      <div className="w-[min(92vw,1000px)]">
        <div className="mb-3 flex items-center justify-between text-white/80 text-sm">
          <span>{label}</span>
          <span>
            {canSkip
              ? "Puedes saltar"
              : `Podrás saltar en ${Math.max(0, Math.ceil(skippableAfter - elapsed))}s`}
          </span>
        </div>

        <div className="relative rounded-xl overflow-hidden border border-white/15 bg-black">
          <video
            ref={videoRef}
            src={src}
            muted
            autoPlay
            playsInline
            controls
            preload="auto"
            className="w-full h-full"
            style={{ maxHeight: "70vh" }}
          />
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={() => {
              try {
                videoRef.current?.pause();
              } catch {}
              onDone();
            }}
            disabled={!canSkip}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
              canSkip
                ? "bg-emerald-600 hover:bg-emerald-500 text-white"
                : "bg-gray-600 text-white/70 cursor-not-allowed"
            }`}
            title={canSkip ? "Saltar anuncio" : `Podrás saltar después de ${skippableAfter}s`}
          >
            {canSkip
              ? "Saltar"
              : `Saltar (${Math.max(0, Math.ceil(skippableAfter - elapsed))}s)`}
          </button>
        </div>
      </div>
    </div>
  );
}