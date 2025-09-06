import clubs from "@/data/clubs.json";
import events from "@/data/events.json";
import ClubCard from "@/components/ClubCard";
import EventCard from "@/components/EventCard";

export default function Home() {
  return (
    <>
      <section className="relative">
        <img src="/hero.jpg" className="w-full h-[56vh] object-cover opacity-90" alt="" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-6xl px-4 pb-10">
          <h1 className="text-4xl md:text-6xl font-extrabold">GOLFCAM</h1>
          <p className="text-slate-300 mt-2 max-w-xl">
            Replays instantáneos desde tee y green. Captura el último minuto y compártelo al instante.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <h2 className="text-2xl font-bold mb-4">Clubes asociados</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {clubs.map(c => <ClubCard key={c.slug} {...c} />)}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <h2 className="text-2xl font-bold mb-4">Próximos eventos</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {events.map(e => <EventCard key={e.id} {...e} />)}
        </div>
      </section>
    </>
  );
}