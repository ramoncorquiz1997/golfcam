"use client";

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
    phone: "+52 646-109-3684",
    schedule: "Lun - Vie · 09:00 a 19:00 h (Tijuana, Mexico)",
    icon: (
      <svg
        className="h-6 w-6 text-orange-400"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M6 8a6 6 0 0 1 6-6v0a6 6 0 0 1 6 6v4a6 6 0 0 0 6 6H0a6 6 0 0 0 6-6Z"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M9 19.5V21a3 3 0 1 0 6 0v-1.5"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>
    ),
  },
  {
    title: "Nuevos proyectos",
    description: "Cotiza instalaciones, paquetes de cámaras o licencias para tu club.",
    email: "hola@clipsazo.com",
    phone: "+52 646-109-3694",
    schedule: "Disponibles también sábados por cita",
    icon: (
      <svg
        className="h-6 w-6 text-orange-400"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
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
    phone: "+52 646-109-3694",
    schedule: "Respuesta en menos de 24 h",
    icon: (
      <svg
        className="h-6 w-6 text-orange-400"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
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
    phone: "+52 646-109-3684",
    schedule: "Lun - Vie · 10:00 a 18:00 h (Tijuana, Mexico)",
    icon: (
      <svg
        className="h-6 w-6 text-orange-400"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
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

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-background text-foreground transition-colors duration-500 relative overflow-hidden">
      {/* blobs adaptativos */}
      <div
        className="absolute inset-x-0 top-[-240px] mx-auto h-[480px] w-[480px] rounded-full
                   bg-orange-500/25 blur-[140px] dark:bg-orange-500/25"
        aria-hidden
      />
      <div
        className="absolute -bottom-32 left-[-120px] h-72 w-72 rounded-full 
                   bg-cyan-400/20 blur-[110px] dark:bg-cyan-400/20"
        aria-hidden
      />

      {/* encabezado */}
      <section className="relative isolate px-6 py-24 sm:py-32 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.32em] text-orange-400">
          Contacto Clipsazo
        </p>
        <h1 className="mt-6 text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
          Conecta tu club deportivo con video inteligente y soporte experto
        </h1>
        <p className="mt-5 text-lg text-muted-foreground sm:text-xl max-w-2xl mx-auto">
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
            href="https://wa.me/526461093694"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-full border border-foreground/20 px-6 py-3 text-base font-semibold transition hover:border-orange-400 hover:text-orange-400"
          >
            WhatsApp inmediato
          </a>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-border bg-foreground/[0.05] p-6 backdrop-blur-sm"
            >
              <p className="text-3xl font-semibold">{stat.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* canales y formulario */}
      <section className="px-6 py-20 sm:py-24">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          {/* canales */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-orange-400">
              Canales directos
            </p>
            <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">
              Resolvemos desde integraciones hasta operación diaria
            </h2>
            <p className="mt-3 max-w-2xl text-base text-muted-foreground sm:text-lg">
              Elige el canal que necesitas o agenda una llamada personalizada.
            </p>

            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              {contactMethods.map((method) => (
                <article
                  key={method.title}
                  className="group rounded-3xl border border-border bg-foreground/[0.05] p-6 transition hover:-translate-y-1 hover:border-orange-400/60 hover:bg-foreground/[0.08]"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-400/10 text-orange-400">
                    {method.icon}
                  </div>
                  <h3 className="mt-5 text-lg font-semibold">{method.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{method.description}</p>
                  <div className="mt-4 space-y-1 text-sm">
                    <a
                      href={`mailto:${method.email}`}
                      className="font-medium text-orange-400 hover:text-orange-300"
                    >
                      {method.email}
                    </a>
                    <p>{method.phone}</p>
                    <p className="text-muted-foreground">{method.schedule}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* formulario */}
          <div className="rounded-3xl border border-border bg-foreground/[0.05] p-8 shadow-lg backdrop-blur-sm">
            <h3 className="text-2xl font-semibold">Agenda una llamada</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Comparte tus datos y un especialista te contactará para diseñar el plan ideal
              para tu club o evento.
            </p>

            <form
              className="mt-8 space-y-6"
              action="mailto:hola@clipsazo.com"
              method="POST"
              encType="text/plain"
            >
              {[
                { name: "nombre", label: "Nombre completo", type: "text", placeholder: "Andrea López" },
                { name: "correo", label: "Correo electrónico", type: "email", placeholder: "tu@email.com" },
                { name: "club", label: "Club o empresa", type: "text", placeholder: "Padel Club" },
              ].map((f) => (
                <label key={f.name} className="block text-sm font-medium">
                  {f.label}
                  <input
                    type={f.type}
                    name={f.name}
                    required
                    placeholder={f.placeholder}
                    className="mt-2 block w-full rounded-2xl border border-border bg-background/60 px-4 py-3 text-base placeholder:text-muted-foreground focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
                  />
                </label>
              ))}

              <label className="block text-sm font-medium">
                Interés principal
                <select
                  name="interes"
                  className="mt-2 block w-full rounded-2xl border border-border bg-background/60 px-4 py-3 text-base focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
                >
                  <option value="instalacion">Instalación y hardware</option>
                  <option value="software">Licencias o software</option>
                  <option value="eventos">Cobertura de torneos</option>
                  <option value="alianzas">Alianzas comerciales</option>
                </select>
              </label>

              <label className="block text-sm font-medium">
                Mensaje
                <textarea
                  name="mensaje"
                  rows={4}
                  className="mt-2 block w-full rounded-2xl border border-border bg-background/60 px-4 py-3 text-base placeholder:text-muted-foreground focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
                  placeholder="Cuéntanos cuántas canchas tienes y qué necesitas…"
                />
              </label>

              <button
                type="submit"
                className="w-full rounded-full bg-orange-500 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-orange-600/30 transition hover:bg-orange-400"
              >
                Enviar mensaje
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}