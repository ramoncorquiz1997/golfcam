import Link from "next/link";

export default function Navbar() {
  return (
    <header className="bg-[var(--primary)] text-[var(--foreground)]">
      <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
        <div className="font-extrabold tracking-wide text-xl text-white">
          GOLFCAM
        </div>
        <nav className="flex gap-6 text-sm">
          <Link href="/" className="hover:underline text-white">
            Inicio
          </Link>
          <Link href="/clubs" className="hover:underline text-white">
            Clubes
          </Link>
          <Link href="/events" className="hover:underline text-white">
            Eventos
          </Link>
          <Link href="/contact" className="hover:underline text-white">
            Contacto
          </Link>
        </nav>
      </div>
    </header>
  );
}