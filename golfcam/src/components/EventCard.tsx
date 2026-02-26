import Image from "next/image";

type Props = {
  title: string;
  club: string;
  date: string;
  cta?: string;
  status?: string;
  image?: string;
};

export default function EventCard({ title, club, date, cta, status, image }: Props) {
  const d = new Date(date);
  const fmt = d.toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const fallback = "/images/events/default.jpg";

  return (
    <div className="rounded-2xl overflow-hidden bg-white/[0.02] dark:bg-white/[0.03] shadow-sm transition-transform transform hover:scale-105 hover:shadow-lg">
      <div className="relative h-40 w-full">
        <Image
          src={image && image.trim() !== "" ? image : fallback}
          alt={title}
          fill
          className="object-cover transition-opacity hover:opacity-90"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={false}
        />
      </div>

      <div className="p-4">
        <div className="text-sm text-green-400 uppercase tracking-wide">{status ?? "Evento"}</div>
        <h3 className="font-semibold text-lg text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground">{club} • {fmt}</p>

        {cta && (
          <a href={cta} className="inline-block mt-3 text-green-400 hover:text-green-300">
            Ver detalles →
          </a>
        )}
      </div>
    </div>
  );
}
