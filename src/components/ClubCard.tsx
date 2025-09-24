// src/components/ClubCard.tsx
import Image from "next/image";

type Props = { name: string; city: string; image?: string; slug?: string };

export default function ClubCard({ name, city, image }: Props) {
  const fallback = "/clubs/default.jpg";
  const imageSrc =
    image && image.trim() !== ""
      ? image.startsWith("http") ? image : `/${image.replace(/^\/?/, "")}`
      : fallback;

  return (
    <div
      className="
        rounded-xl overflow-hidden
        border border-white/10
        bg-white/[0.02] dark:bg-white/[0.03]
        shadow-sm transition-transform hover:scale-105 hover:shadow-lg hover:border-emerald-500
      "
    >
      <div className="relative w-full h-48">
        <Image
          src={imageSrc}
          alt={name}
          fill
          className="object-cover transition-opacity hover:opacity-90"
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