// src/app/recordings/page.tsx
"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import ClubCard from "@/components/ClubCard";
import { haversine } from "@/lib/geo";
import { getClubs, type Club as ApiClub } from "@/lib/api";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
} from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import L from "leaflet";

// ---- Tipos ----

type Court = { slug: string; name: string; image?: string };

// Extendemos el tipo Club que viene de la API por si en el futuro
// traemos canchas anidadas.
type ClubWithCourts = ApiClub & {
  courts?: Court[];
};

// Helper para resolver la URL de imagen del club
function getClubImage(club: ClubWithCourts): string | undefined {
  const value = club.image_url ?? club.image ?? undefined;
  if (!value) return undefined;
  if (value.startsWith("http")) return value;
  // Normaliza: "images/..." -> "/images/..."
  return `/${value.replace(/^\/?/, "")}`;
}

// ---- Componentes auxiliares para el mapa ----

type ClubsMapProps = {
  clubs: ClubWithCourts[];
  userLoc: { lat: number; lon: number } | null;
};

function ChangeView({ center }: { center: LatLngExpression }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center, map]);
  return null;
}

function ClubsMap({ clubs, userLoc }: ClubsMapProps) {
  const markers = useMemo(
    () =>
      clubs.filter(
        (c) => typeof c.lat === "number" && typeof c.lon === "number",
      ),
    [clubs],
  );

  const defaultCenter: LatLngExpression = [23.6345, -102.5528]; // centro MX aprox

  const center: LatLngExpression = userLoc
    ? [userLoc.lat, userLoc.lon]
    : markers.length > 0
    ? [markers[0].lat as number, markers[0].lon as number]
    : defaultCenter;

  return (
    <div className="mt-4 rounded-lg overflow-hidden border h-[420px]">
      <MapContainer
        center={center}
        zoom={userLoc ? 10 : 5}
        style={{ width: "100%", height: "100%" }}
        scrollWheelZoom
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <ChangeView center={center} />

        {/* Pin de usuario */}
        {userLoc && <Marker position={[userLoc.lat, userLoc.lon]} />}

        {/* Pins de clubes */}
        {markers.map((club) => {
          const src = getClubImage(club);
          const icon = src
            ? L.divIcon({
                html: `<div class="club-pin-inner"><img src="${src}" alt="${club.name}" /></div>`,
                className: "club-pin",
                iconSize: [40, 40],
                iconAnchor: [20, 40],
              })
            : undefined;

          return (
            <Marker
              key={club.slug}
              position={[club.lat as number, club.lon as number]}
              icon={icon}
            />
          );
        })}
      </MapContainer>
    </div>
  );
}

// ---- Página principal ----

export default function RecordingsPage() {
  const [clubs, setClubs] = useState<ClubWithCourts[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [viewMode, setViewMode] = useState<"list" | "map">("list");

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
      if (!arr.includes(state)) arr.insert?.(arr.length, state) ?? arr.push(state);
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
      if (!arr.includes(city)) arr.insert?.(arr.length, city) ?? arr.push(city);
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

  // Cuando cambias a modo mapa y no hay loc todavía, pide ubicación
  useEffect(() => {
    if (viewMode === "map" && !loc && geoStatus === "idle") {
      requestLocation();
    }
  }, [viewMode, loc, geoStatus]);

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
            cerca de ti o explorar el mapa.
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

        {/* Controles de filtro + toggle vista */}
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
                {/* Toggle lista / mapa */}
                <div className="inline-flex rounded-lg border border-border bg-card overflow-hidden text-xs">
                  <button
                    type="button"
                    onClick={() => setViewMode("list")}
                    className={`px-3 py-1.5 ${
                      viewMode === "list"
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent"
                    }`}
                  >
                    Lista
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("map")}
                    className={`px-3 py-1.5 ${
                      viewMode === "map"
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent"
                    }`}
                  >
                    Mapa
                  </button>
                </div>

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

        {/* Vista LISTA */}
        {viewMode === "list" && !loading && !error && clubs.length > 0 && (
          <>
            {/* Cerca de ti */}
            {loc && (
              <section className="space-y-3">
                <h2 className="text-lg font-semibold">Cerca de ti</h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {nearby.map(({ club, km }) => (
                    <Link
                      key={club.slug}
                      href={`/recordings/${club.slug}`}
                      prefetch
                    >
                      <div className="space-y-2">
                        <ClubCard
                          name={club.name}
                          city={[club.city, club.state]
                            .filter(Boolean)
                            .join(", ")}
                          image={getClubImage(club)}
                        />
                        <div className="text-xs text-muted-foreground">
                          A ~{km.toFixed(1)} km • {club.city}
                          {club.state ? `, ${club.state}` : ""} —{" "}
                          {club.country}
                        </div>
                      </div>
                    </Link>
                  ))}
                  {nearby.length === 0 && (
                    <div className="text-sm text-muted-foreground">
                      No encontramos clubes con coordenadas cerca de tu
                      ubicación.
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Todos los clubes */}
            <section className="space-y-3">
              <h2 className="text-lg font-semibold">Todos los clubes</h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((club) => (
                  <Link key={club.slug} href={`/recordings/${club.slug}`}>
                    <ClubCard
                      name={club.name}
                      city={[club.city, club.state]
                        .filter(Boolean)
                        .join(", ")}
                      image={getClubImage(club)}
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
          </>
        )}

        {/* Vista MAPA */}
        {viewMode === "map" && !loading && !error && clubs.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-lg font-semibold">Mapa de clubes</h2>
            <ClubsMap clubs={filtered} userLoc={loc} />
            {!loc && (
              <p className="text-xs text-muted-foreground">
                Usa el botón &quot;Usar mi ubicación&quot; para centrar el
                mapa en tu posición.
              </p>
            )}
          </section>
        )}
      </section>
    </main>
  );
}