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

  useEffect(() => {
    getAdminTables().then(setTables).catch(() => setTables([]));
  }, []);

  useEffect(() => {
    if (!selected) return;
    setLoading(true);
    setError(null);
    getAdminTable(selected, { limit: 50 })
      .then((data) => {
        setRows(data.items);
      })
      .catch((err) => {
        setError(String(err));
        setRows([]);
      })
      .finally(() => setLoading(false));
  }, [selected]);

  const columns = rows[0] ? Object.keys(rows[0]) : [];

  return (
    <main className="min-h-screen bg-background text-foreground p-6">
      <h1 className="text-2xl font-bold mb-4">Admin DB</h1>

      <div className="mb-4 flex gap-2 items-center">
        <label className="text-sm">Tabla:</label>
        <select
          className="border rounded px-2 py-1 bg-background"
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
        >
          <option value="">Selecciona una tabla...</option>
          {tables.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {loading && <p>Cargando...</p>}
      {error && <p className="text-red-500 text-sm">{error}</p>}

      {!loading && !error && selected && rows.length === 0 && (
        <p className="text-sm text-muted-foreground">No hay filas.</p>
      )}

      {!loading && rows.length > 0 && (
        <div className="overflow-auto border rounded-lg">
          <table className="min-w-full text-sm">
            <thead className="bg-muted">
              <tr>
                {columns.map((col) => (
                  <th key={col} className="px-3 py-2 text-left font-semibold">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className="border-t">
                  {columns.map((col) => (
                    <td key={col} className="px-3 py-1">
                      {String(row[col] ?? "")}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
