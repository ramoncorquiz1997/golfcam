import { ReactNode } from "react";

type ContactMethod = {
  title: string;
  description: string;
  email: string;
  phone: string;
  schedule: string;
  icon: ReactNode;
};

const stats = [
  { label: "Tiempo medio de respuesta", value: "< 12 h" },
  { label: "Clubes activos", value: "120+" },
  { label: "Feeds operando cada mes", value: "2.8K" },
];

const contactMethods: ContactMethod[] = [
  {
    title: "Operaciones y soporte",
    description: "Hardware, mantenimiento y monitoreo en vivo para tus canchas.",
    email: "soporte@clipsazo.com",
    phone: "+52 55 4162 9905",
    schedule: "Lun - Vie · 09:00 a 19:00 h (CDMX)",
    icon: (
      <svg
        className="h-6 w-6 text-orange-300"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M6 8a6 6 0 0 1 6-6v0a6 6 0 0 1 6 6v4a6 6 0 0 0 6 6H0a6 6 0 0 0 6-6Z"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path d="M9 19.5V21a3 3 0 1 0 6 0v-1.5" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    title: "Nuevos proyectos",
    description: "Cotiza instalaciones, paquetes de cámaras o licencias para tu club.",
    email: "hola@clipsazo.com",
    phone: "+34 93 173 4018",
    schedule: "Disponibles también sábados por cita",
    icon: (
      <svg className="h-6 w-6 text-orange-300" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M3 5.5h18M3 12h11M3 18.5h6"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="18" cy="12" r="3.25" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    title: "Prensa y alianzas",
    description: "Coberturas especiales, sponsors o proyectos con federaciones.",
    email: "partners@clipsazo.com",
    phone: "+57 1 508 1329",
    schedule: "Respuesta en menos de 24 h",
    icon: (
      <svg className="h-6 w-6 text-orange-300" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 21c5.523 0 10-4.477 10-10S17.523 1 12 1 2 5.477 2 11s4.477 10 10 10Z"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M7.5 14.5C8.74 16.47 10.4 17.5 12 17.5s3.26-1.03 4.5-3"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="8" cy="9" r="1" fill="currentColor" />
        <circle cx="16" cy="9" r="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    title: "Facturación",
    description: "Actualización de planes, pagos internacionales y reportes.",
    email: "finance@clipsazo.com",
    phone: "+52 55 8000 7711",
    schedule: "Lun - Vie · 10:00 a 18:00 h (CDMX)",
    icon: (
      <svg className="h-6 w-6 text-orange-300" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M5 3h14a2 2 0 0 1 2 2v14.286L16 17l-5 3-5-3-5 2.286V5a2 2 0 0 1 2-2Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M9 9.5h6M9 12h4M9 14.5h6"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];

const faqs = [
  {
    question: "¿En cuánto tiempo instalan las cámaras en un club nuevo?",
    answer:
      "Coordinamos visita técnica en máximo 72 horas. Una vez definidos los puntos de energía y red, instalamos de 4 a 8 canchas en menos de 48 horas.",
  },
  {
    question: "¿Puedo integrar Clipsazo con mi software de reservas?",
    answer:
      "Sí. Tenemos integraciones listas para reservas como Playtomic, MisZonas y sistemas propietarios mediante API. Cuéntanos qué usas y lo conectamos.",
  },
  {
    question: "¿Tienen cobertura fuera de México?",
    answer:
      "Prestamos servicio en Latinoamérica y España mediante partners locales. El soporte remoto es 24/7 y el hardware se envía calibrado.",
  },
  {
    question: "¿El soporte tiene costo adicional?",
    answer:
      "Está incluido en todos los planes. Solo cobramos desplazamientos extraordinarios cuando no están relacionados con la operación de Clipsazo.",
  },
];

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="relative isolate overflow-hidden px-6 py-24 sm:py-32">
        <div
          className="absolute inset-x-0 top-[-240px] mx-auto h-[480px] w-[480px] rounded-full bg-orange-500/25 blur-[140px]"
          aria-hidden
        />
        <div
          className="absolute -bottom-32 left-[-120px] h-72 w-72 rounded-full bg-cyan-400/20 blur-[110px]"
          aria-hidden
        />

        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.32em] text-orange-200">
            Contacto Clipsazo
          </p>
          <h1 className="mt-6 text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
            Conecta tu club deportivo con video inteligente y soporte experto
          </h1>
          <p className="mt-5 text-lg text-white/70 sm:text-xl">
            Escríbenos para agendar una demo, recibir una cotización o resolver dudas
            operativas. Respondemos rápido y con un equipo que conoce la cancha.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <a
              href="mailto:hola@clipsazo.com"
              className="inline-flex items-center justify-center rounded-full bg-orange-500 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-orange-500/30 transition hover:bg-orange-400"
            >
              Escríbenos
            </a>
            <a
              href="https://wa.me/5215512345678"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-base font-semibold text-white transition hover:border-orange-400 hover:text-orange-200"
            >
              WhatsApp inmediato
            </a>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {stats.map(stat => (
              <div
                key={stat.label}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur"
              >
                <p className="text-3xl font-semibold text-white">{stat.value}</p>
                <p className="mt-1 text-sm text-white/70">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20 sm:py-24">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-orange-300">
              Canales directos
            </p>
            <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
              Resolvemos desde integraciones hasta operación diaria
            </h2>
            <p className="mt-3 max-w-2xl text-base text-white/70 sm:text-lg">
              Elige el canal que necesitas o agenda una llamada personalizada. Nuestro equipo
              acompaña a clubes, academias y organizadores de torneos en toda la región.
            </p>

            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              {contactMethods.map(method => (
                <article
                  key={method.title}
                  className="group rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:-translate-y-1 hover:border-orange-400/60 hover:bg-white/10"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-orange-300">
                    {method.icon}
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-white">{method.title}</h3>
                  <p className="mt-2 text-sm text-white/70">{method.description}</p>
                  <div className="mt-4 space-y-1 text-sm text-white/80">
                    <a
                      href={`mailto:${method.email}`}
                      className="font-medium text-orange-200 transition hover:text-white"
                    >
                      {method.email}
                    </a>
                    <p>{method.phone}</p>
                    <p className="text-white/60">{method.schedule}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_25px_80px_rgba(5,3,16,0.45)] backdrop-blur">
            <h3 className="text-2xl font-semibold text-white">Agenda una llamada</h3>
            <p className="mt-2 text-sm text-white/70">
              Comparte tus datos y un especialista te contactará para diseñar el plan ideal
              para tu club o evento.
            </p>
            <form
              className="mt-8 space-y-6"
              action="mailto:hola@clipsazo.com"
              method="POST"
              encType="text/plain"
            >
              <input type="hidden" name="subject" value="Contacto desde clipsazo.com" />
              <label className="block text-sm font-medium text-white/80">
                Nombre completo
                <input
                  type="text"
                  name="nombre"
                  required
                  className="mt-2 block w-full rounded-2xl border border-white/15 bg-black/20 px-4 py-3 text-base text-white placeholder:text-white/40 focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-400"
                  placeholder="Andrea López"
                />
              </label>
              <label className="block text-sm font-medium text-white/80">
                Correo electrónico
                <input
                  type="email"
                  name="correo"
                  required
                  className="mt-2 block w-full rounded-2xl border border-white/15 bg-black/20 px-4 py-3 text-base text-white placeholder:text-white/40 focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-400"
                  placeholder="tu@email.com"
                />
              </label>
              <label className="block text-sm font-medium text-white/80">
                Club o empresa
                <input
                  type="text"
                  name="club"
                  className="mt-2 block w-full rounded-2xl border border-white/15 bg-black/20 px-4 py-3 text-base text-white placeholder:text-white/40 focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-400"
                  placeholder="Palmas Padel"
                />
              </label>
              <label className="block text-sm font-medium text-white/80">
                Interés principal
                <select
                  name="interes"
                  className="mt-2 block w-full rounded-2xl border border-white/15 bg-black/20 px-4 py-3 text-base text-white focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-400"
                  defaultValue="instalacion"
                >
                  <option value="instalacion" className="text-black">
                    Instalación y hardware
                  </option>
                  <option value="software" className="text-black">
                    Licencias o software
                  </option>
                  <option value="eventos" className="text-black">
                    Cobertura de torneos
                  </option>
                  <option value="alianzas" className="text-black">
                    Alianzas comerciales
                  </option>
                </select>
              </label>
              <label className="block text-sm font-medium text-white/80">
                Mensaje
                <textarea
                  name="mensaje"
                  rows={4}
                  className="mt-2 block w-full rounded-2xl border border-white/15 bg-black/20 px-4 py-3 text-base text-white placeholder:text-white/40 focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-400"
                  placeholder="Cuéntanos cuántas canchas tienes y qué necesitas…"
                />
              </label>
              <button
                type="submit"
                className="w-full rounded-full bg-orange-500 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-orange-600/30 transition hover:bg-orange-400"
              >
                Enviar mensaje
              </button>
              <p className="text-xs text-white/50">
                Al enviar aceptas ser contactado por el equipo de Clipsazo y recibir noticias
                relevantes para tu club. Nunca compartimos tus datos.
              </p>
            </form>
          </div>
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-orange-300">
              Visítanos
            </p>
            <h3 className="mt-3 text-2xl font-semibold text-white">Showroom CDMX</h3>
            <p className="mt-2 text-sm text-white/70">
              Agenda una demostración presencial para probar cámaras 4K, overlays en vivo y
              flujos de highlights automatizados.
            </p>
            <div className="mt-6 rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
              <p className="text-base font-medium text-white">Calzada Gral. Mariano Escobedo 510</p>
              <p className="text-sm text-white/70">Miguel Hidalgo · Ciudad de México</p>
              <p className="mt-4 text-sm text-white/60">Atención con cita previa</p>
              <a
                href="https://goo.gl/maps/Zv1Q93J7X6C2"
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex items-center text-sm font-semibold text-orange-200 hover:text-white"
              >
                Ver en Google Maps
                <svg className="ml-2 h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M7 17 17 7m0 0H8m9 0v9"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </a>
            </div>
            <div className="mt-6 h-56 overflow-hidden rounded-2xl border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(250,86,11,0.4),_transparent_60%)]">
              <div className="flex h-full flex-col justify-between p-6">
                <div className="text-sm font-semibold uppercase tracking-[0.3em] text-white/60">
                  Experiencia Immersive
                </div>
                <div>
                  <p className="text-lg font-semibold text-white">Prueba real-time replay</p>
                  <p className="text-sm text-white/70">
                    Te mostramos la configuración completa: cámaras, servidores edge y panel de
                    control.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-orange-300">
              Preguntas frecuentes
            </p>
            <h3 className="mt-3 text-2xl font-semibold text-white">Todo lo que solemos responder</h3>
            <div className="mt-6 space-y-5">
              {faqs.map(item => (
                <details
                  key={item.question}
                  className="group rounded-2xl border border-white/10 bg-black/10 p-5"
                >
                  <summary className="flex cursor-pointer items-center justify-between text-base font-semibold text-white/90">
                    {item.question}
                    <span className="ml-2 text-orange-300 transition group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-sm text-white/70">{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
