"use client";

import Image from "next/image";
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
      {/* blobs */}
      <div
        className="absolute inset-x-0 top-[-240px] mx-auto h-[480px] w-[480px] rounded-full bg-orange-500/25 blur-[140px] dark:bg-orange-500/25"
        aria-hidden
      />
      <div
        className="absolute -bottom-32 left-[-120px] h-72 w-72 rounded-full bg-cyan-400/20 blur-[110px] dark:bg-cyan-400/20"
        aria-hidden
      />

      {/* HERO */}
      {/* HERO */}
      <section className="relative isolate overflow-hidden">
        {/* Video de fondo */}
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="/hero.jpg"
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src="/hero.mp4" type="video/mp4" />
        </video>

        {/* Overlay: degrade + blur para contraste */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent backdrop-blur-[4px]" />

        {/* Blobs decorativos */}
        <div
          className="absolute -top-40 left-1/2 h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-orange-500/25 blur-[140px]"
          aria-hidden
        />
        <div
          className="absolute -bottom-32 left-[-120px] h-72 w-72 rounded-full bg-cyan-400/20 blur-[110px]"
          aria-hidden
        />

        {/* Contenido */}
        <div className="relative mx-auto max-w-6xl px-4 pt-40 pb-16 text-foreground">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.32em] text-orange-400">
              Replays • Torneos • Clubes
            </p>
            <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-semibold leading-tight drop-shadow-[0_2px_6px_rgba(0,0,0,0.4)]">
              Clipsazo: video inteligente para tu club deportivo
            </h1>
            <p className="mt-3 text-lg text-muted-foreground max-w-xl drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)]">
              Revive las mejores jugadas y compártelas al momento. Instalación rápida,
              soporte experto y herramientas para eventos.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full bg-orange-500 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-orange-500/30 transition hover:bg-orange-400"
            >
              Agendar demo
            </Link>
            <Link
              href="/recordings"
              className="inline-flex items-center justify-center rounded-full border border-white/30 px-6 py-3 text-base font-semibold text-white transition hover:border-orange-400 hover:text-orange-400"
            >
              Ver grabaciones
            </Link>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              { label: "Ciudades donde nos encontramos", value: "3" },
              { label: "Clubes activos", value: "7" },
              { label: "Feeds mensuales", value: "35" },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-white/10 bg-background/30 backdrop-blur-md p-4"
              >
                <p className="text-2xl font-semibold text-foreground">{s.value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CLUBES */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.32em] text-orange-400">
              Clubes asociados
            </p>
            <h2 className="mt-2 text-3xl font-semibold sm:text-4xl">Listos para grabar</h2>
          </div>
          <Link
            href="/clubs"
            className="text-sm font-semibold text-orange-400 hover:text-orange-300"
          >
            Ver todos →
          </Link>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {clubs.slice(0, 3).map((c) => (
            <div
              key={c.slug}
              className="group rounded-3xl bg-foreground/[0.07] p-2 backdrop-blur-sm transition-colors duration-300 hover:bg-foreground/[0.1]"
            >
              <ClubCard {...c} />
            </div>
          ))}
        </div>
      </section>

      {/* EVENTOS */}
      <section className="mx-auto max-w-6xl px-4 pb-24">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.32em] text-orange-400">
              Próximos eventos
            </p>
            <h2 className="mt-2 text-3xl font-semibold sm:text-4xl">
              Coberturas y torneos
            </h2>
          </div>
          <Link
            href="/events"
            className="text-sm font-semibold text-orange-400 hover:text-orange-300"
          >
            Calendario →
          </Link>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {events.map((e) => (
            <div
              key={e.id}
              className="group rounded-3xl bg-foreground/[0.07] p-2 backdrop-blur-sm transition-colors duration-300 hover:bg-foreground/[0.1]"
            >
              <EventCard {...e} />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}