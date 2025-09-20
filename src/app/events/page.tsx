// src/app/events/page.tsx
import events from "@/data/events.json";
import EventCard from "@/components/EventCard";

export const metadata = {
  title: "Eventos | Rip It",
  description: "Próximos torneos y actividades",
};

export default function EventsPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-6">Próximos eventos</h1>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((e) => (
            <EventCard
              key={e.id}
              title={e.title}
              club={e.club}
              date={e.date}
              status={e.status}
              cta={e.cta}
            />
          ))}
        </div>
      </section>
    </main>
  );
}