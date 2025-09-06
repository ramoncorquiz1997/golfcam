import Link from "next/link";

export default function Navbar() {
  return (
    <header className="border-b border-white/10">
      <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
        <div className="font-extrabold tracking-wide text-xl">GOLFCAM</div>
        <nav className="flex gap-6 text-sm text-slate-300">
          <Link href="/" className="hover:text-white">
            Inicio
          </Link>
          <Link href="/clubs" className="hover:text-white">
            Clubes
          </Link>
          <Link href="/events" className="hover:text-white">
            Eventos
          </Link>
          <Link href="/contact" className="hover:text-white">
            Contacto
          </Link>
        </nav>
      </div>
    </header>
  );
}