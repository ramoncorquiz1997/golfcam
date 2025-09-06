// src/app/events/page.tsx
import Image from "next/image";

export const metadata = {
  title: "Events | Golfcam",
  description: "Próximos eventos y torneos en clubes asociados a Golfcam",
};

type EventItem = {
  id: string;
  title: string;
  club: string;
  city: string;
  date: string;   // ISO string o texto legible
  time: string;   // rango u hora
  cover: string;  // ruta en /public/events/
  cta?: string;
  url?: string;
};

const EVENTS: EventItem[] = [
  {
    id: "ens-2025-09-campestre",
    title: "Copa Campestre Ensenada",
    club: "Campestre",
    city: "Ensenada, BC",
    date: "2025-09-20",
    time: "7:30 AM – 2:00 PM",
    cover: "/events/campestre-ensenada.jpg",
    cta: "Ver detalles",
    url: "#",
  },
  {
    id: "lam-2025-10-bajar-mar",
    title: "Abierto Bajar Mar",
    club: "Bajar Mar",
    city: "La Misión, BC",
    date: "2025-10-05",
    time: "8:00 AM – 3:30 PM",
    cover: "/events/bajar-mar.jpg",
    cta: "Ver detalles",
    url: "#",
  },
  {
    id: "tij-2025-11-campestre",
    title: "Invitacional Campestre Tijuana",
    club: "Campestre",
    city: "Tijuana, BC",
    date: "2025-11-16",
    time: "7:00 AM – 1:30 PM",
    cover: "/events/campestre-tijuana.jpg",
    cta: "Ver detalles",
    url: "#",
  },
];

function formatDate(d: string) {
  try {
    const dt = new Date(d);
    return dt.toLocaleDateString("es-MX", { year: "numeric", month: "long", day: "numeric" });
  } catch {
    return d;
  }
}

export default function EventsPage() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <section className="max-w-6xl mx-auto px-4 py-10">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Eventos y torneos</h1>
          <p className="text-gray-600 mt-2">
            Próximas fechas en los clubes asociados a Golfcam.
          </p>
        </header>

        
      </section>
    </main>
  );
}