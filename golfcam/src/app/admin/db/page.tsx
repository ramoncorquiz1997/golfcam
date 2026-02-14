// src/app/admin/db/page.tsx
import Link from "next/link";
import { getAdminTables } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function AdminDbIndexPage() {
  const tables = await getAdminTables();

  return (
    <main className="min-h-screen bg-background text-foreground p-6">
      <h1 className="text-2xl font-bold mb-4">Admin DB</h1>

      <section className="border rounded-lg p-4 max-w-md">
        <h2 className="text-sm font-semibold mb-2">Tablas disponibles</h2>

        {tables.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No hay tablas configuradas en <code>/api/admin/tables</code>.
          </p>
        )}

        {tables.length > 0 && (
          <table className="min-w-full text-sm border rounded-lg overflow-hidden">
            <thead className="bg-muted">
              <tr>
                <th className="px-3 py-2 text-left font-semibold">Tabla</th>
                <th className="px-3 py-2 text-left font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {tables.map((t) => (
                <tr key={t} className="border-t">
                  <td className="px-3 py-2">{t}</td>
                  <td className="px-3 py-2">
                    <Link
                      href={`/admin/db/${encodeURIComponent(t)}`}
                      className="text-xs underline hover:no-underline"
                    >
                      Ver registros
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </main>
  );
}