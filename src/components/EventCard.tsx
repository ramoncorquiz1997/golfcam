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
    year: "numeric" 
  });

  const fallback = "images/events/default.jpg"; // asegúrate de que esté en public/events/

  return (
    <div
      className="rounded-2xl overflow-hidden border border-white/10 bg-white/[0.02] shadow-sm
                 transition-transform transform hover:scale-105 hover:shadow-lg hover:border-green-500"
    >
      {/* Imagen opcional */}
      <div className="relative h-40">
        <img 
          src={image && image.trim() !== "" ? image : fallback}
          alt={title}
          className="w-full h-full object-cover transition-opacity hover:opacity-90"
        />
      </div>

      <div className="p-4">
        <div className="text-sm text-emerald-400 uppercase tracking-wide">
          {status ?? "Evento"}
        </div>
        <div className="font-semibold text-lg">{title}</div>
        <div className="text-slate-400 text-sm">
          {club} • {fmt}
        </div>
        {cta && (
          <a 
            className="inline-block mt-3 text-sky-400 hover:text-sky-300" 
            href={cta}
          >
            Ver detalles →
          </a>
        )}
      </div>
    </div>
  );
}