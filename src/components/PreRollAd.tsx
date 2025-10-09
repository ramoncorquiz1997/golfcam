"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  src: string;                  // /sponsors/<slug>/hole-<n>.mp4
  onDone: () => void;           // cerrar overlay al terminar / saltar
  skippableLastSeconds?: number; // lo usaremos como "skippableAfterSeconds" (=10 por defecto)
};

export default function PreRollAd({
  src,
  onDone,
  skippableLastSeconds = 10, // interpreta: se puede saltar DESPUÉS de N segundos desde el inicio
}: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [canSkip, setCanSkip] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [error, setError] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const onTime = () => {
      setElapsed(v.currentTime || 0);
      // habilita salto después de N segundos desde el inicio
      if (v.currentTime >= skippableLastSeconds) setCanSkip(true);
    };

    const onEnded = () => onDone();

    const onCanPlay = () => {
      // Autoplay fiable: muted + playsInline + autoplay en el tag
      v.play().catch(() => {
        // El usuario tendrá que dar click a play, pero seguirá contando tiempo
      });
    };

    const onErr = () => {
      setError(true);
      // No bloquees si falla el recurso
      onDone();
    };

    v.addEventListener("timeupdate", onTime);
    v.addEventListener("ended", onEnded);
    v.addEventListener("canplay", onCanPlay);
    v.addEventListener("error", onErr);

    // Fallback: si por alguna razón no dispara timeupdate (autoplay bloqueado),
    // arrancamos un temporizador que habilite el salto a los 10s desde montaje
    const fallback = window.setTimeout(() => setCanSkip(true), skippableLastSeconds * 1000);

    return () => {
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("ended", onEnded);
      v.removeEventListener("canplay", onCanPlay);
      v.removeEventListener("error", onErr);
      window.clearTimeout(fallback);
    };
  }, [onDone, skippableLastSeconds]);

  if (error) return null;

  return (
    <div className="fixed inset-0 z-[1000] bg-black/90 backdrop-blur-sm grid place-items-center">
      <div className="w-[min(92vw,1000px)]">
        <div className="mb-3 flex items-center justify-between text-white/80 text-sm">
          <span>Anuncio del patrocinador</span>
          <span>Transcurrido {Math.floor(elapsed)}s</span>
        </div>

        <div className="relative rounded-xl overflow-hidden border border-white/15 bg-black">
          <video
            ref={videoRef}
            src={src}
            controls
            playsInline
            muted
            autoPlay
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
            title={canSkip ? "Saltar anuncio" : `Podrás saltar en ${skippableLastSeconds}s`}
          >
            {canSkip ? "Saltar" : `Saltar (${skippableLastSeconds}s)`}
          </button>
        </div>
      </div>
    </div>
  );
}