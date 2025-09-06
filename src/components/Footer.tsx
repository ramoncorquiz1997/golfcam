export default function Footer() {
    return (
      <footer className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-slate-400">
          © {new Date().getFullYear()} GolfCam. Todos los derechos reservados.
        </div>
      </footer>
    );
  }