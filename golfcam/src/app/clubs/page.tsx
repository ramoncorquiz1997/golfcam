// src/app/clubs/page.tsx
import Link from "next/link";
import ClubCard from "@/components/ClubCard";
import { getClubs } from "@/lib/api";

export const metadata = {
  title: "Clubs | Ripitcam",
  description: "Campos y clubes asociados a Ripitcam",
};

export default async function ClubsPage() {
  const { items: clubs } = await getClubs({ limit: 100 });

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-6">Clubs</h1>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {clubs.map((c) => (
            <Link key={c.slug} href={`/recordings/${c.slug}`} className="group block">
              <ClubCard
                name={c.name}
                city={[c.city, c.state].filter(Boolean).join(", ")}
                image={c.image_url || c.image || "/clubs/default.jpg"}
                slug={c.slug}
              />
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
