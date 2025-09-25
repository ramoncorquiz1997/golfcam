"use client";
import Link from "next/link";
import { useState } from "react";
import s from "./Navbar.module.css";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className={s.header}>
      <div className={s.container}>
        <Link href="/" className={s.logo}>
          Rip It
        </Link>

        {/* Botón hamburguesa (móvil) */}
        <button
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="Abrir menú"
          className={s.burger}
        >
          {/* Ícono hamburguesa/X en SVG para no depender de libs */}
          {!open ? (
            <svg width="26" height="26" viewBox="0 0 24 24" className={s.icon} aria-hidden="true">
              <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          ) : (
            <svg width="26" height="26" viewBox="0 0 24 24" className={s.icon} aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          )}
        </button>

        {/* Navegación desktop */}
        <nav className={s.navDesktop}>
          <Link href="/" className={s.link}>Inicio</Link>
          <Link href="/clubs" className={s.link}>Clubes</Link>
          <Link href="/recordings" className={s.link}>Grabaciones</Link>
          <Link href="/events" className={s.link}>Eventos</Link>
          <Link href="/contact" className={s.link}>Contacto</Link>
        </nav>
      </div>

      {/* Menú móvil */}
      <div className={`${s.mobileWrap} ${open ? s.open : ""}`}>
        <nav className={s.navMobile}>
          {[
            { href: "/", label: "Inicio" },
            { href: "/clubs", label: "Clubes" },
            { href: "/recordings", label: "Grabaciones" },
            { href: "/events", label: "Eventos" },
            { href: "/contact", label: "Contacto" },
          ].map(i => (
            <Link key={i.href} href={i.href} className={s.mobileLink} onClick={() => setOpen(false)}>
              {i.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}