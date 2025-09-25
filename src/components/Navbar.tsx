"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react"; // iconos, puedes instalarlos con: npm i lucide-react

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-[var(--primary)] text-[var(--foreground)]">
      <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="font-extrabold tracking-wide text-xl text-white transition-transform hover:scale-105 hover:text-[var(--secondary)]"
        >
          Rip It
        </Link>

        {/* Botón hamburguesa en móvil */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-white focus:outline-none"
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Navegación en escritorio */}
        <nav className="hidden md:flex gap-6 text-sm">
          <Link href="/" className="hover:text-[var(--secondary)]">Inicio</Link>
          <Link href="/clubs" className="hover:text-[var(--secondary)]">Clubes</Link>
          <Link href="/recordings" className="hover:text-[var(--secondary)]">Grabaciones</Link>
          <Link href="/events" className="hover:text-[var(--secondary)]">Eventos</Link>
          <Link href="/contact" className="hover:text-[var(--secondary)]">Contacto</Link>
        </nav>
      </div>

      {/* Menú móvil desplegable */}
      {open && (
        <nav className="md:hidden bg-[var(--primary)] px-4 pb-4 flex flex-col gap-4 text-sm">
          <Link href="/" onClick={() => setOpen(false)} className="hover:text-[var(--secondary)]">Inicio</Link>
          <Link href="/clubs" onClick={() => setOpen(false)} className="hover:text-[var(--secondary)]">Clubes</Link>
          <Link href="/recordings" onClick={() => setOpen(false)} className="hover:text-[var(--secondary)]">Grabaciones</Link>
          <Link href="/events" onClick={() => setOpen(false)} className="hover:text-[var(--secondary)]">Eventos</Link>
          <Link href="/contact" onClick={() => setOpen(false)} className="hover:text-[var(--secondary)]">Contacto</Link>
        </nav>
      )}
    </header>
  );
}