// src/app/admin/db/page.tsx
"use client";

import { useEffect, useState } from "react";
import { getAdminTables, getAdminTable, type AdminRow } from "@/lib/api";

export default function AdminDbPage() {
  const [tables, setTables] = useState<string[]>([]);
  const [selected, setSelected] = useState<string>("");
  const [rows, setRows] = useState<AdminRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carga la lista de tablas al montar
  useEffect(() => {
    getAdminTables()
      .then((t) => {
        setTables(t);
        if (t.length > 0 && !selected) {
          // Selecciona la primera por defecto
          setSelected(t[0]);
        }
      })
      .catch((err) => {
        console.error("getAdminTables error", err);
        setTables([]);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Carga filas cuando cambia la tabla seleccionada
  useEffect(() => {
    if (!selected) return;
    setLoading(true);
    setError(null);

    getAdminTable(selected, { limit: 50 })
      .then((data) => {
        setRows(data.items);
      })
      .catch((err) => {
        console.error("getAdminTable error", err);
        setError(String(err));
        setRows([]);
      })
      .finally(() => setLoading(false));
  }, [selected]);

  const columns = rows[0] ? Object.keys(rows[0]) : [];

  return (
    <main className="min-h-screen bg-background text-foreground p-6">
      <h1 className="text-2xl font-bold mb-4">Admin DB</h1>

      <div className="grid grid-cols-1 md:grid-cols-[220px,1fr] gap-4">
        {/* Sidebar: lista de tablas */}
        <aside className="border rounded-lg p-3">
          <h2 className="text-sm font-semibold mb-2">Tablas</h2>

          {tables.length === 0 && (
            <p className="text-xs text-muted-foreground">
              No hay tablas configuradas en /api/admin/tables.
            </p>
          )}

          <ul className="space-y-1">
            {tables.map((t) => {
              const isActive = t === selected;
              return (
                <li key={t}>
                  <button
                    type="button"
                    onClick={() => setSelected(t)}
                    className={`w-full text-left text-sm px-2 py-1 rounded ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    }`}
                  >
                    {t}
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>

        {/* Panel principal: contenido de la tabla seleccionada */}
        <section className="border rounded-lg p-3">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-semibold">
                {selected ? `Tabla: ${selected}` : "Selecciona una tabla"}
              </h2>
              {selected && (
                <p className="text-xs text-muted-foreground">
                  Mostrando hasta 50 registros.
                </p>
              )}
            </div>
          </div>

          {loading && <p className="text-sm">Cargando...</p>}

          {error && (
            <p className="text-sm text-red-500">
              Error cargando datos: {error}
            </p>
          )}

          {!loading && !error && selected && rows.length === 0 && (
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
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, i) => (
                    <tr key={i} className="border-t">
                      {columns.map((col) => (
                        <td key={col} className="px-3 py-1 align-top">
                          {String(row[col] ?? "")}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
