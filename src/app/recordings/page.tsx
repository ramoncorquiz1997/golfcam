// src/app/recordings/page.tsx
import clubs from "@/data/clubs.json";
import Link from "next/link";
import ClubCard from "@/components/ClubCard";

export const metadata = {
  title: "Grabaciones | Rip It",
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
            <Link key={club.slug} href={`/recordings/${club.slug}`}>
              <ClubCard {...club} />
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}