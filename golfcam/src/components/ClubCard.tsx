// src/components/ClubCard.tsx
import Image from "next/image";

type Props = { name: string; city: string; image?: string; slug?: string };

export default function ClubCard({ name, city, image }: Props) {
  // Asegúrate de que el fallback apunte a donde realmente está el archivo:
  const fallback = "/images/clubs/default.jpg";

  const raw = (image || "").trim();
  const imageSrc =
    raw === ""
      ? fallback
      : raw.startsWith("http")
        ? raw
        : raw.startsWith("/")
          ? raw
          : `/${raw}`; // "images/clubs/..." -> "/images/clubs/..."

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
          // 👇 esto es la clave: desactiva el optimizador de Next
          unoptimized
          className="object-contain bg-black/20 transition-opacity hover:opacity-90"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      <div className="p-4">
        <h2 className="font-semibold text-foreground">{name}</h2>
        <p className="text-sm text-foreground/60">{city}</p>
      </div>
    </div>
  );
}