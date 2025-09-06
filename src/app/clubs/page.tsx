// src/app/clubs/page.tsx
import Image from "next/image";

export const metadata = {
  title: "Clubs | Golfcam",
  description: "Campos y clubes asociados a Golfcam",
};

export default function ClubsPage() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <section className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-6">Clubs</h1>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <article className="border rounded-xl overflow-hidden shadow-sm">
            <div className="relative h-40">
              <Image src="/clubs/campestre-ensenada.jpg" alt="Campestre Ensenada" fill style={{objectFit:"cover"}}/>
            </div>
            <div className="p-4">
              <h2 className="font-semibold">Campestre</h2>
              <p className="text-sm text-gray-500">Ensenada, BC</p>
            </div>
          </article>

          <article className="border rounded-xl overflow-hidden shadow-sm">
            <div className="relative h-40">
              <Image src="/clubs/bajar-mar.jpg" alt="Bajar Mar" fill style={{objectFit:"cover"}}/>
            </div>
            <div className="p-4">
              <h2 className="font-semibold">Bajar Mar</h2>
              <p className="text-sm text-gray-500">La Misión, BC</p>
            </div>
          </article>

          <article className="border rounded-xl overflow-hidden shadow-sm">
            <div className="relative h-40">
              <Image src="/clubs/campestre-tijuana.jpg" alt="Campestre Tijuana" fill style={{objectFit:"cover"}}/>
            </div>
            <div className="p-4">
              <h2 className="font-semibold">Campestre</h2>
              <p className="text-sm text-gray-500">Tijuana, BC</p>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
