type Props = { name: string; city: string; image: string; };
export default function ClubCard({ name, city, image }: Props) {
  return (
    <div className="rounded-2xl overflow-hidden border border-white/10 bg-white/[0.02]">
      <img src={image} alt={name} className="w-full h-48 object-cover" />
      <div className="p-4">
        <div className="font-semibold">{name}</div>
        <div className="text-slate-400 text-sm">{city}</div>
      </div>
    </div>
  );
}