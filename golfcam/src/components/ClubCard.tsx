// src/components/ClubCard.tsx
import Image from "next/image";

type Props = { name: string; city: string; image?: string; slug?: string };

export default function ClubCard({ name, city, image }: Props) {
  // Fallback correcto, el archivo está en public/images/clubs/default.jpg
  const fallback = "/images/clubs/default.jpg";

  // Normalizamos la ruta:
  // - si viene vacía -> fallback
  // - si empieza con http o / -> la dejamos tal cual
  // - si viene como "images/clubs/..." -> le ponemos "/" delante
  const raw = (image || "").trim();
  const imageSrc =
    raw === ""
      ? fallback
      : raw.startsWith("http")
      ? raw
      : raw.startsWith("/")
      ? raw
      : `/${raw}`;

  return (
    <div
      className="
        rounded-xl overflow-hidden
        border border-white/10
        bg-white/[0.02] dark:bg-white/[0.03]
        shadow-sm transition-transform hover:scale-105 hover:shadow-lg
      "
    >
      <div className="relative w-full h-48">
        <Image
          src={imageSrc}
          alt={name}
          fill
          className="object-cover bg-black/20 transition-opacity hover:opacity-90"
          sizes="(max-width: 768px) 100vw, 33vw"
          // 👇 clave para quitar el error 400 de /_next/image
          unoptimized
        />
      </div>
      <div className="p-4">
        <h2 className="font-semibold text-foreground">{name}</h2>
        <p className="text-sm text-foreground/60">{city}</p>
      </div>
    </div>
  );
}