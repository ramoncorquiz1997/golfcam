"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  src: string;                 // /sponsors/<slug>/hole-<n>.mp4
  onDone: () => void;          // cerrar overlay al terminar / saltar
  skippableLastSeconds?: number; // por defecto 10
};

export default function PreRollAd({ src, onDone, skippableLastSeconds = 10 }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [canSkip, setCanSkip] = useState(false);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const onTime = () => {
      if (!v.duration || isNaN(v.duration)) return;
      const rem = Math.max(0, v.duration - v.currentTime);
      setRemaining(rem);
      if (rem <= skippableLastSeconds) setCanSkip(true);
    };

    const onEnded = () => onDone();
    const onCanPlay = () => {
      // intento de autoplay
      v.play().catch(() => {/* el usuario tendrá que dar play */});
    };
    const onErr = () => {
      setError(true);
      // si el recurso no existe o hay error, no bloquear
      onDone();
    };

    v.addEventListener("timeupdate", onTime);
    v.addEventListener("ended", onEnded);
    v.addEventListener("canplay", onCanPlay);
    v.addEventListener("error", onErr);
    return () => {
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("ended", onEnded);
      v.removeEventListener("canplay", onCanPlay);
      v.removeEventListener("error", onErr);
    };
  }, [onDone, skippableLastSeconds]);

  if (error) return null;

  return (
    <div className="fixed inset-0 z-[1000] bg-black/90 backdrop-blur-sm grid place-items-center">
      <div className="w-[min(92vw,1000px)]">
        <div className="mb-3 flex items-center justify-between text-white/80 text-sm">
          <span>Anuncio del patrocinador</span>
          {remaining !== null && (
            <span>Quedan {Math.ceil(remaining)}s</span>
          )}
        </div>

        <div className="relative rounded-xl overflow-hidden border border-white/15 bg-black">
          <video
            ref={videoRef}
            src={src}
            controls
            playsInline
            // Autoplay más compatible: arrancamos muted
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
            title={canSkip ? "Saltar anuncio" : "Podrás saltar en los últimos 10s"}
          >
            {canSkip ? "Saltar" : "Saltar (al final)"}
          </button>
        </div>
      </div>
    </div>
  );
}