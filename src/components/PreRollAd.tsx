"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  src: string;                 // /sponsors/<slug>/hole-<n>.mp4
  onDone: () => void;          // cerrar overlay al terminar / saltar
  skippableLastSeconds?: number; // ignorado para el skip (usamos 10s fijos)
};

export default function PreRollAd({ src, onDone }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Skip puro por tiempo transcurrido:
  const [canSkip, setCanSkip] = useState(false);
  const skipTimerRef = useRef<number | null>(null);
  const SKIP_DELAY_MS = 10_000; // 10 segundos

  // (Opcional) sólo para mostrar “Quedan Xs” si el video reporta duración
  const [remaining, setRemaining] = useState<number | null>(null);

  const [error, setError] = useState(false);

  useEffect(() => {
    // Habilita el botón de saltar a los 10s, sin depender del estado del <video>
    skipTimerRef.current = window.setTimeout(() => setCanSkip(true), SKIP_DELAY_MS);

    const v = videoRef.current;
    if (!v) return () => {};

    // Intento de autoplay fiable: muted + playsInline + autoPlay
    const onCanPlay = () => {
      v.play().catch(() => {
        // si no arranca solo, el usuario le puede dar play con los controles
      });
    };

    const onTime = () => {
      if (!v.duration || Number.isNaN(v.duration)) return;
      const rem = Math.max(0, v.duration - v.currentTime);
      setRemaining(rem);
    };

    const onEnded = () => onDone();

    const onErr = () => {
      setError(true);
      // No bloquees por un fallo en el recurso
      onDone();
    };

    v.addEventListener("canplay", onCanPlay);
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("ended", onEnded);
    v.addEventListener("error", onErr);

    return () => {
      if (skipTimerRef.current) {
        clearTimeout(skipTimerRef.current);
        skipTimerRef.current = null;
      }
      v.removeEventListener("canplay", onCanPlay);
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("ended", onEnded);
      v.removeEventListener("error", onErr);
    };
  }, [onDone]);

  if (error) return null;

  return (
    <div className="fixed inset-0 z-[1000] bg-black/90 backdrop-blur-sm grid place-items-center">
      <div className="w-[min(92vw,1000px)]">
        <div className="mb-3 flex items-center justify-between text-white/80 text-sm">
          <span>Anuncio del patrocinador</span>
          {remaining !== null && <span>Quedan {Math.ceil(remaining)}s</span>}
        </div>

        <div className="relative rounded-xl overflow-hidden border border-white/15 bg-black">
          <video
            ref={videoRef}
            src={src}
            // Autoplay fiable en móviles: muted + playsInline + autoPlay
            muted
            playsInline
            autoPlay
            controls
            className="w-full h-full"
            style={{ maxHeight: "70vh" }}
          />
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={onDone}
            disabled={!canSkip}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition
              ${canSkip
                ? "bg-emerald-600 hover:bg-emerald-500 text-white"
                : "bg-gray-600 text-white/70 cursor-not-allowed"}`}
            title={canSkip ? "Saltar anuncio" : "Podrás saltar en 10s"}
          >
            {canSkip ? "Saltar" : "Saltar en 10s…"}
          </button>
        </div>
      </div>
    </div>
  );
}