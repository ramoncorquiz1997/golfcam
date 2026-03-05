"use client";

import Link from "next/link";
import clubsData from "@/data/clubs.json";
import eventsData from "@/data/events.json";
import ClubCard from "@/components/ClubCard";
import EventCard from "@/components/EventCard";

type Court = { slug: string; name: string; image?: string };
type Club = {
  slug: string;
  name: string;
  city: string;
  state?: string;
  country: string;
  lat?: number;
  lon?: number;
  image?: string;
  courts?: Court[];
};

type Event = {
  id: string;
  title: string;
  club: string;
  date: string;
  cta?: string;
  status?: string;
  image?: string;
};

export default function Home() {
  const clubs = clubsData as Club[];
  const events = eventsData as Event[];

  return (
    <main className="min-h-screen bg-background text-foreground transition-colors duration-500 relative overflow-hidden">
      <div className="absolute inset-x-0 top-[-240px] mx-auto h-[480px] w-[480px] rounded-full bg-[#088f26]/20 blur-[140px]" aria-hidden />
      <div className="absolute -bottom-32 left-[-120px] h-72 w-72 rounded-full bg-emerald-500/20 blur-[110px]" aria-hidden />

      <section className="relative isolate overflow-hidden bg-background min-h-[62vh] sm:min-h-[66vh]">
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="/hero.jpg"
          className="absolute inset-0 h-full w-full object-cover"
          style={{
            WebkitMaskImage:
              "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 62%, rgba(0,0,0,0.92) 72%, rgba(0,0,0,0.55) 86%, rgba(0,0,0,0) 100%)",
            maskImage:
              "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 62%, rgba(0,0,0,0.92) 72%, rgba(0,0,0,0.55) 86%, rgba(0,0,0,0) 100%)",
          }}
        >
          <source src="/hero.mp4" type="video/mp4" />
        </video>

        <div className="relative mx-auto flex min-h-[62vh] max-w-6xl items-end px-4 pb-14 text-foreground sm:min-h-[66vh]">
          <div className="max-w-3xl">
            <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-semibold leading-tight drop-shadow-[0_2px_6px_rgba(0,0,0,0.4)]">
              Ripit
            </h1>
            <p className="mt-3 text-lg text-muted-foreground max-w-xl drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)]">
              Replays instantáneos desde tee y green. Captura tu golpe y compártelo al instante.
            </p>
          </div>

        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-base sm:text-lg font-semibold uppercase tracking-[0.32em] text-[#088f26]">
              Clubes asociados
            </p>
          </div>
          <Link href="/clubs" className="text-sm font-semibold text-[#088f26] hover:text-[#0ab530]">
            Ver todos →
          </Link>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {clubs.slice(0, 3).map((c) => (
            <Link key={c.slug} href={`/recordings/${c.slug}`} className="group rounded-3xl bg-foreground/[0.07] p-2 backdrop-blur-sm transition-colors duration-300 hover:bg-foreground/[0.1]">
              <ClubCard name={c.name} city={c.city} image={c.image} slug={c.slug} />
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-24">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.32em] text-[#088f26]">
              Proximos eventos
            </p>
            <h2 className="mt-2 text-3xl font-semibold sm:text-4xl">Coberturas y torneos</h2>
          </div>
          <Link href="/events" className="text-sm font-semibold text-[#088f26] hover:text-[#0ab530]">
            Calendario →
          </Link>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {events.map((e) => (
            <div key={e.id} className="group rounded-3xl bg-foreground/[0.07] p-2 backdrop-blur-sm transition-colors duration-300 hover:bg-foreground/[0.1]">
              <EventCard {...e} />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
