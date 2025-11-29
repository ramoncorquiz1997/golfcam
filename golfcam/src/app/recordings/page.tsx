// src/app/recordings/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import ClubCard from "@/components/ClubCard";
import { haversine } from "@/lib/geo";
import { getClubs, type Club } from "@/lib/api";

type Court = { slug: string; name: string; image?: string };
// Si en el futuro el backend regresa canchas, las podemos meter aquí
type ClubWithCourts = Club & {
  courts?: Court[];
};

export default function RecordingsPage() {
  const [clubs, setClubs] = useState<ClubWithCourts[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar clubes desde la API (DB)
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getClubs({ limit: 200 });
        setClubs(data.items as ClubWithCourts[]);
      } catch (err) {
        setError(String(err));
        setClubs([]);
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  const countries = useMemo(
    () =>
      Array.from(new Set(clubs.map((c) => (c.country || "").trim())))
        .filter(Boolean)
        .sort(),
    [clubs],
  );

  const statesByCountry = useMemo(() => {
    const map = new Map<string, string[]>();
    for (const c of clubs) {
      const country = (c.country || "").trim();
      const state = (c.state || "").trim();
      if (!country || !state) continue;
      if (!map.has(country)) map.set(country, []);
      const arr = map.get(country)!;
      if (!arr.includes(state)) arr.push(state);
    }
    for (const arr of map.values()) arr.sort();
    return map;
  }, [clubs]);

  const citiesByCountryState = useMemo(() => {
    const map = new Map<string, string[]>();
    for (const c of clubs) {
      const country = (c.country || "").trim();
      const state = (c.state || "").trim();
      const city = (c.city || "").trim();
      if (!country || !city) continue;
      const key = `${country}||${state || ""}`;
      if (!map.has(key)) map.set(key, []);
      const arr = map.get(key)!;
      if (!arr.includes(city)) arr.push(city);
    }
    for (const arr of map.values()) arr.sort();
    return map;
  }, [clubs]);

  const [q, setQ] = useState("");
  const [country, setCountry] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [city, setCity] = useState<string>("");

  const stateOptions = useMemo(() => {
    if (!country)
      return Array.from(new Set(clubs.map((c) => (c.state || "").trim())))
        .filter(Boolean)
        .sort();
    return statesByCountry.get(country) || [];
  }, [country, clubs, statesByCountry]);

  const cityOptions = useMemo(() => {
    const key = `${country || ""}||${state || ""}`;
    if (!country && !state) {
      return Array.from(new Set(clubs.map((c) => (c.city || "").trim())))
        .filter(Boolean)
        .sort();
    }
    return citiesByCountryState.get(key) || [];
  }, [country, state, clubs, citiesByCountryState]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return clubs.filter((c) => {
      if (country && (c.country || "").trim() !== country) return false;
      if (state && (c.state || "").trim() !== state) return false;
      if (city && (c.city || "").trim() !== city) return false;
      if (!needle) return true;

      const haystack = [
        c.name,
        c.slug,
        c.city,
        c.state,
        c.country,
        ...(c.courts?.map((ct) => `${ct.name} ${ct.slug}`) || []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(needle);
    });
  }, [clubs, q, country, state, city]);

  const reset = () => {
    setQ("");
    setCountry("");
    setState("");
    setCity("");
  };

  const [loc, setLoc] = useState<{ lat: number; lon: number } | null>(null);
  const [geoStatus, setGeoStatus] = useState<
    "idle" | "denied" | "error" | "ok"
  >("idle");

  const requestLocation = () => {
    if (!("geolocation" in navigator)) {
      setGeoStatus("error");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLoc({ lat: pos.coords.latitude, lon: pos.coords.longitude });
        setGeoStatus("ok");
      },
      () => setGeoStatus("denied"),
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 300000 },
    );
  };

  const nearby = useMemo(() => {
    if (!loc) return [];
    return clubs
      .filter((c) => typeof c.lat === "number" && typeof c.lon === "number")
      .map((c) => ({
        club: c,
        km: haversine(
          { lat: loc.lat, lon: loc.lon },
          { lat: c.lat as number, lon: c.lon as number },
        ),
      }))
      .sort((a, b) => a.km - b.km)
      .slice(0, 6);
  }, [loc, clubs]);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="max-w-6xl mx-auto px-4 py-10 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Grabaciones</h1>
          <p className="text-sm text-muted-foreground">
            Selecciona un club o filtra por ubicación. También puedes ver clubes
            cerca de ti.
          </p>
        </div>

        {/* Estado de carga / error */}
        {loading && (
          <p className="text-sm text-muted-foreground">Cargando clubes…</p>
        )}
        {error && (
          <p className="text-sm text-red-500">
            Error cargando clubes: {error}
          </p>
        )}

        {/* Controles de filtro */}
        {!loading && !error && clubs.length > 0 && (
          <>
            <div className="grid gap-3 md:grid-cols-5">
              <div className="md:col-span-2">
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Buscar por club, ciudad, estado, país, o cancha…"
                  className="w-full px-3 py-2 rounded-lg bg-background text-foreground border border-input placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ring-offset-2 ring-offset-background"
                />
              </div>

              <div>
                <select
                  value={country}
                  onChange={(e) => {
                    setCountry(e.target.value);
                    setState("");
                    setCity("");
                  }}
                  className="w-full px-3 py-2 rounded-lg bg-background text-foreground border border-input focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ring-offset-2 ring-offset-background"
                >
                  <option value="">Todos los países</option>
                  {countries.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <select
                  value={state}
                  onChange={(e) => {
                    setState(e.target.value);
                    setCity("");
                  }}
                  className="w-full px-3 py-2 rounded-lg bg-background text-foreground border border-input focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ring-offset-2 ring-offset-background"
                  disabled={!country && stateOptions.length === 0}
                >
                  <option value="">Todos los estados</option>
                  {stateOptions.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-background text-foreground border border-input focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ring-offset-2 ring-offset-background"
                  disabled={cityOptions.length === 0}
                >
                  <option value="">Todas las ciudades</option>
                  {cityOptions.map((ct) => (
                    <option key={ct} value={ct}>
                      {ct}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Mostrando{" "}
                <span className="font-medium text-foreground">
                  {filtered.length}
                </span>{" "}
                de{" "}
                <span className="font-medium text-foreground">
                  {clubs.length}
                </span>{" "}
                clubes
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={reset}
                  className="px-3 py-1.5 rounded-lg border border-border bg-card hover:ring-1 hover:ring-primary/40 text-sm"
                >
                  Limpiar filtros
                </button>
                <button
                  onClick={requestLocation}
                  className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground hover:opacity-90 text-sm"
                >
                  {geoStatus === "ok"
                    ? "Actualizar ubicación"
                    : "Usar mi ubicación"}
                </button>
              </div>
            </div>
          </>
        )}

        {/* Cerca de ti */}
        {loc && !loading && !error && (
          <section className="space-y-3">
            <h2 className="text-lg font-semibold">Cerca de ti</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {nearby.map(({ club, km }) => (
                <Link key={club.slug} href={`/recordings/${club.slug}`} prefetch>
                  <div className="space-y-2">
                    <ClubCard
                      name={club.name}
                      city={[club.city, club.state].filter(Boolean).join(", ")}
                      image={(club.image_url ?? club.image) || undefined}
                    />
                    <div className="text-xs text-muted-foreground">
                      A ~{km.toFixed(1)} km • {club.city}
                      {club.state ? `, ${club.state}` : ""} — {club.country}
                    </div>
                  </div>
                </Link>
              ))}
              {nearby.length === 0 && (
                <div className="text-sm text-muted-foreground">
                  No encontramos clubes con coordenadas cerca de tu ubicación.
                </div>
              )}
            </div>
          </section>
        )}

        {/* Todos los clubes */}
        {!loading && !error && clubs.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-lg font-semibold">Todos los clubes</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((club) => (
                <Link key={club.slug} href={`/recordings/${club.slug}`}>
                  <ClubCard
                    name={club.name}
                    city={[club.city, club.state].filter(Boolean).join(", ")}
                    image={(club.image_url ?? club.image) || undefined}
                  />
                </Link>
              ))}
              {filtered.length === 0 && (
                <div className="md:col-span-4 text-sm text-muted-foreground">
                  No se encontraron clubes con esos filtros.
                </div>
              )}
            </div>
          </section>
        )}
      </section>
    </main>
  );
}