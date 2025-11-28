// src/app/admin/db/[table]/page.tsx
"use client";

import { useEffect, useState, FormEvent } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  getAdminTable,
  type AdminRow,
  adminCreateClub,
  adminDeleteClub,
} from "@/lib/api";
import MapPicker from "@/components/MapPicker";

type NewClubForm = {
  slug: string;
  name: string;
  country: string;
  city: string;
  state: string;
  image_url: string;
  lat: string;
  lon: string;
};

export default function AdminTablePage() {
  const params = useParams<{ table: string }>();
  const table = params.table;

  const [rows, setRows] = useState<AdminRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [newClub, setNewClub] = useState<NewClubForm>({
    slug: "",
    name: "",
    country: "",
    city: "",
    state: "",
    image_url: "",
    lat: "",
    lon: "",
  });

  const [showMap, setShowMap] = useState(false);

  const isClubs = table === "clubs";

  const columns = rows[0] ? Object.keys(rows[0] as AdminRow) : [];

  const loadData = async () => {
    if (!table) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getAdminTable(table, { limit: 50 });
      setRows(data.items);
    } catch (err) {
      setError(String(err));
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table]);

  const handleDelete = async (id: number) => {
    if (!isClubs) return;
    const confirmDelete = window.confirm(
      `¿Seguro que quieres borrar el club con id ${id}?`,
    );
    if (!confirmDelete) return;

    try {
      await adminDeleteClub(id);
      await loadData();
    } catch (err) {
      // eslint-disable-next-line no-alert
      alert(String(err));
    }
  };

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    if (!isClubs) return;

    if (!newClub.slug || !newClub.name || !newClub.country) {
      // eslint-disable-next-line no-alert
      alert("slug, name y country son obligatorios");
      return;
    }

    const latValue =
      newClub.lat.trim() === "" ? null : Number.parseFloat(newClub.lat);
    const lonValue =
      newClub.lon.trim() === "" ? null : Number.parseFloat(newClub.lon);

    try {
      await adminCreateClub({
        slug: newClub.slug.trim(),
        name: newClub.name.trim(),
        country: newClub.country.trim(),
        city: newClub.city.trim() || undefined,
        state: newClub.state.trim() || undefined,
        image_url: newClub.image_url.trim() || undefined,
        lat: latValue === null || Number.isNaN(latValue) ? null : latValue,
        lon: lonValue === null || Number.isNaN(lonValue) ? null : lonValue,
      });

      setNewClub({
        slug: "",
        name: "",
        country: "",
        city: "",
        state: "",
        image_url: "",
        lat: "",
        lon: "",
      });
      await loadData();
    } catch (err) {
      // eslint-disable-next-line no-alert
      alert(String(err));
    }
  };

  const handleOpenMap = () => {
    setShowMap(true);
  };

  const handleCancelMap = () => {
    setShowMap(false);
  };

  const handleSelectLocation = (lat: number, lon: number) => {
    setNewClub((prev) => ({
      ...prev,
      lat: lat.toFixed(5),
      lon: lon.toFixed(5),
    }));
    setShowMap(false);
  };

  const hasCoords =
    newClub.lat.trim() !== "" && newClub.lon.trim() !== "";

  return (
    <main className="min-h-screen bg-background text-foreground p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Admin DB — {table}</h1>
        <Link
          href="/admin/db"
          className="text-sm underline hover:no-underline"
        >
          ← Volver a tablas
        </Link>
      </div>

      {/* Formulario para clubs */}
      {isClubs && (
        <section className="border rounded-lg p-3 mb-4">
          <h2 className="text-sm font-semibold mb-2">Nuevo club</h2>
          <form
            onSubmit={handleCreate}
            className="grid gap-2 md:grid-cols-2 lg:grid-cols-3"
          >
            <label className="flex flex-col text-xs gap-1">
              <span>Slug *</span>
              <input
                className="border rounded px-2 py-1 bg-background"
                value={newClub.slug}
                onChange={(e) =>
                  setNewClub((prev) => ({ ...prev, slug: e.target.value }))
                }
              />
            </label>

            <label className="flex flex-col text-xs gap-1">
              <span>Nombre *</span>
              <input
                className="border rounded px-2 py-1 bg-background"
                value={newClub.name}
                onChange={(e) =>
                  setNewClub((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </label>

            <label className="flex flex-col text-xs gap-1">
              <span>País *</span>
              <input
                className="border rounded px-2 py-1 bg-background"
                value={newClub.country}
                onChange={(e) =>
                  setNewClub((prev) => ({ ...prev, country: e.target.value }))
                }
              />
            </label>

            <label className="flex flex-col text-xs gap-1">
              <span>Ciudad</span>
              <input
                className="border rounded px-2 py-1 bg-background"
                value={newClub.city}
                onChange={(e) =>
                  setNewClub((prev) => ({ ...prev, city: e.target.value }))
                }
              />
            </label>

            <label className="flex flex-col text-xs gap-1">
              <span>Estado</span>
              <input
                className="border rounded px-2 py-1 bg-background"
                value={newClub.state}
                onChange={(e) =>
                  setNewClub((prev) => ({ ...prev, state: e.target.value }))
                }
              />
            </label>

            <label className="flex flex-col text-xs gap-1">
              <span>Image URL</span>
              <input
                className="border rounded px-2 py-1 bg-background"
                value={newClub.image_url}
                onChange={(e) =>
                  setNewClub((prev) => ({
                    ...prev,
                    image_url: e.target.value,
                  }))
                }
              />
            </label>

            {/* Coordenadas con selector de mapa */}
            <div className="flex flex-col text-xs gap-1 md:col-span-2 lg:col-span-3">
              <span>Ubicación en mapa (Lat / Lon)</span>
              <div className="flex flex-wrap items-center gap-2">
                {hasCoords && (
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 rounded bg-muted">
                      Lat: {newClub.lat}
                    </span>
                    <span className="px-2 py-1 rounded bg-muted">
                      Lon: {newClub.lon}
                    </span>
                  </div>
                )}
                {!hasCoords && (
                  <span className="text-[11px] text-muted-foreground">
                    Aún no has elegido coordenadas.
                  </span>
                )}
                <button
                  type="button"
                  onClick={handleOpenMap}
                  className="px-3 py-1 rounded border text-[11px] md:text-xs hover:bg-accent"
                >
                  Elegir en mapa
                </button>
              </div>

              {/* Inputs ocultos con el valor real para el submit */}
              <input type="hidden" value={newClub.lat} readOnly />
              <input type="hidden" value={newClub.lon} readOnly />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="px-3 py-1 rounded bg-primary text-primary-foreground text-xs"
              >
                Guardar
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="border rounded-lg p-3">
        <p className="text-xs text-muted-foreground mb-2">
          Mostrando hasta 50 registros.
        </p>

        {loading && <p className="text-sm">Cargando...</p>}

        {error && (
          <p className="text-sm text-red-500">Error cargando datos: {error}</p>
        )}

        {!loading && !error && rows.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No hay filas en esta tabla.
          </p>
        )}

        {!loading && rows.length > 0 && (
          <div className="overflow-auto border rounded-lg">
            <table className="min-w-full text-xs md:text-sm">
              <thead className="bg-muted">
                <tr>
                  {columns.map((col) => (
                    <th
                      key={col}
                      className="px-3 py-2 text-left font-semibold"
                    >
                      {col}
                    </th>
                  ))}
                  {isClubs && (
                    <th className="px-3 py-2 text-left font-semibold">
                      Acciones
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={i} className="border-t">
                    {columns.map((col) => (
                      <td key={col} className="px-3 py-1 align-top">
                        {String((row as AdminRow)[col] ?? "")}
                      </td>
                    ))}
                    {isClubs && (
                      <td className="px-3 py-1 align-top">
                        {"id" in row && typeof row.id === "number" && (
                          <button
                            type="button"
                            className="text-red-600 text-xs underline hover:no-underline"
                            onClick={() => handleDelete(row.id as number)}
                          >
                            Borrar
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {showMap && (
        <MapPicker
          initialLat={
            newClub.lat.trim() !== "" ? Number.parseFloat(newClub.lat) : undefined
          }
          initialLon={
            newClub.lon.trim() !== "" ? Number.parseFloat(newClub.lon) : undefined
          }
          onCancel={handleCancelMap}
          onSelect={handleSelectLocation}
        />
      )}
    </main>
  );
}