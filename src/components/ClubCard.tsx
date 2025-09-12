type Props = { name: string; city: string; image?: string; slug: string };

export default function ClubCard({ name, city, image, slug }: Props) {
  const fallback = "images/clubs/default.jpg";

  return (
    <div
      className="rounded-xl overflow-hidden border border-white/10 bg-white/[0.02] shadow-sm
                 transition-transform transform hover:scale-105 hover:shadow-lg hover:border-green-500"
    >
      <img
        src={image && image.trim() !== "" ? image : fallback}
        alt={name}
        className="w-full h-48 object-cover transition-opacity hover:opacity-90"
      />
      <div className="p-4">
        <h2 className="font-semibold">{name}</h2>
        <p className="text-sm text-slate-400">{city}</p>
      </div>
    </div>
  );
}