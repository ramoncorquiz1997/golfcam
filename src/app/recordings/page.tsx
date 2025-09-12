// src/app/recordings/page.tsx
import clubs from "@/data/clubs.json";
import Link from "next/link";

export const metadata = {
  title: "Grabaciones | Golfcam",
  description: "Selecciona un club para ver las grabaciones",
};

export default function RecordingsPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-6">Grabaciones</h1>
        <p className="text-slate-500 mb-8">
          Selecciona un club para ver las grabaciones disponibles.
        </p>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {clubs.map((club) => (
            <Link
              key={club.slug}
              href={`/recordings/${club.slug}`}
              className="block rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm
                         transition-transform transform hover:scale-105 hover:shadow-lg hover:border-green-500"
            >
              <div className="relative h-40">
                <img
                  src={club.image && club.image.trim() !== "" ? club.image : "/clubs/default.jpg"}
                  alt={club.name}
                  className="w-full h-full object-cover transition-opacity hover:opacity-90"
                />
              </div>
              <div className="p-4">
                <h2 className="font-semibold">{club.name}</h2>
                <p className="text-sm text-gray-500">{club.city}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}