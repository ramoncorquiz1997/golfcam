// src/app/clubs/page.tsx
import clubs from "@/data/clubs.json";
import ClubCard from "@/components/ClubCard";

export const metadata = {
  title: "Clubs | Rip It",
  description: "Campos y clubes asociados a Rip It",
};

export default function ClubsPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-6">Clubs</h1>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {clubs.map(c => (
            <ClubCard key={c.slug} {...c} />
          ))}
        </div>
      </section>
    </main>
  );
}