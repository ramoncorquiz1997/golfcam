type Props = { title: string; club: string; date: string; cta?: string; status?: string; };
export default function EventCard({ title, club, date, cta, status }: Props) {
  const d = new Date(date);
  const fmt = d.toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" });
  return (
    <div className="rounded-2xl p-4 border border-white/10 bg-white/[0.02]">
      <div className="text-sm text-emerald-400 uppercase tracking-wide">{status ?? "Evento"}</div>
      <div className="font-semibold text-lg">{title}</div>
      <div className="text-slate-400 text-sm">{club} • {fmt}</div>
      {cta && <a className="inline-block mt-3 text-sky-400 hover:text-sky-300" href={cta}>Ver detalles →</a>}
    </div>
  );
}