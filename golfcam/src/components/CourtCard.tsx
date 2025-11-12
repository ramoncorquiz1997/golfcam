import Image from "next/image";
import Link from "next/link";

type Props = {
  name: string;
  image?: string;
  href: string;           // a dónde navega al hacer click (/recordings/[slug]/[date]/[court])
  subtitle?: string;      // opcional: “Cancha techada”, etc.
};

export default function CourtCard({ name, image, href, subtitle }: Props) {
  const fallback = "/courts/default.jpg";
  const imageSrc =
    image && image.trim() !== ""
      ? image.startsWith("http") ? image : `/${image.replace(/^\/?/, "")}`
      : fallback;

  return (
    <Link href={href} className="block group">
      <div
        className="
          rounded-xl overflow-hidden
          border border-white/10
          bg-white/[0.02] dark:bg-white/[0.03]
          shadow-sm transition-transform group-hover:scale-105 group-hover:shadow-lg group-hover:border-emerald-500
          focus:outline-none focus:ring-2 focus:ring-emerald-500
        "
      >
        <div className="relative w-full h-40">
          <Image
            src={imageSrc}
            alt={name}
            fill
            className="object-cover transition-opacity group-hover:opacity-90"
            sizes="(max-width: 768px) 100vw, 33vw"
            priority={false}
          />
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-foreground">{name}</h3>
          {subtitle ? (
            <p className="text-sm text-foreground/60">{subtitle}</p>
          ) : null}
        </div>
      </div>
    </Link>
  );
}