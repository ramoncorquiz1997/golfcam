export default function Navbar() {
    return (
      <header className="border-b border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <div className="font-extrabold tracking-wide text-xl">GOLFCAM</div>
          <nav className="flex gap-6 text-sm text-slate-300">
            <a href="/" className="hover:text-white">Inicio</a>
            <a href="/clubs" className="hover:text-white">Clubes</a>
            <a href="/events" className="hover:text-white">Eventos</a>
            <a href="/contact" className="hover:text-white">Contacto</a>
          </nav>
        </div>
      </header>
    );
  }