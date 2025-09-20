import Link from "next/link";

export default function Navbar() {
  return (
    <header className="bg-[var(--primary)] text-[var(--foreground)]">
      <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
        {/* Logo / título */}
        <Link
          href="/"
          className="font-extrabold tracking-wide text-xl text-white transition-transform hover:scale-105 hover:text-[var(--secondary)]"
        >
          Rip It
        </Link>

        {/* Navegación */}
        <nav className="flex gap-6 text-sm">
          <Link
            href="/"
            className="text-white transition-colors hover:text-[var(--secondary)]"
          >
            Inicio
          </Link>
          <Link
            href="/clubs"
            className="text-white transition-colors hover:text-[var(--secondary)]"
          >
            Clubes
          </Link>
          <Link
            href="/recordings"
            className="text-white transition-colors hover:text-[var(--secondary)]"
          >
            Grabaciones
          </Link>
          <Link
            href="/events"
            className="text-white transition-colors hover:text-[var(--secondary)]"
          >
            Eventos
          </Link>
          <Link
            href="/contact"
            className="text-white transition-colors hover:text-[var(--secondary)]"
          >
            Contacto
          </Link>
        </nav>
      </div>
    </header>
  );
}