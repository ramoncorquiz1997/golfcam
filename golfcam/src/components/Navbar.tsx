"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import s from "./Navbar.module.css";

/** Permite usar la custom prop CSS --alpha sin recurrir a `any` */
type CSSVars = React.CSSProperties & { ["--alpha"]?: number };

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [alpha, setAlpha] = useState(0.86); // alpha base
  const [shrink, setShrink] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || 0;
      const a = Math.max(0.62, 0.86 - Math.min(y, 400) / 400 * 0.24);
      setAlpha(Number(a.toFixed(3)));
      setShrink(y > 40);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const headerStyle: CSSVars = { ["--alpha"]: alpha };

  return (
    <header
      ref={headerRef}
      className={`${s.header} ${shrink ? s.shrink : ""}`}
      style={headerStyle}
    >
      <div className={s.container}>
        <Link href="/" className={s.logo} aria-label="Clipsazo">
          {/* Desktop */}
          <Image
            src="/images/logo_blanco.png"
            alt="Clipsazo"
            width={1024}
            height={287}
            className={s.logoImg}
            priority
          />
          {/* Móvil */}
          <Image
            src="/images/logo_blanco_icono.png"
            alt="Clipsazo"
            width={320}
            height={88}
            className={s.logoImgIcon}
            priority
          />
        </Link>

        <button
          onClick={() => setOpen(v => !v)}
          aria-expanded={open}
          aria-label="Abrir menú"
          className={s.burger}
        >
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

        <nav className={s.navDesktop}>
          <Link href="/" className={s.link}>Inicio</Link>
          <Link href="/clubs" className={s.link}>Clubes</Link>
          <Link href="/recordings" className={s.link}>Grabaciones</Link>
          <Link href="/events" className={s.link}>Eventos</Link>
          <Link href="/contact" className={s.link}>Contacto</Link>
        </nav>
      </div>

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