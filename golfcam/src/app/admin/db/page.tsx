// src/app/admin/db/[table]/page.tsx
import Link from "next/link";
import { getAdminTable, type AdminRow } from "@/lib/api";

export const dynamic = "force-dynamic";

type Props = {
  params: { table: string };
};

export default async function AdminTablePage({ params }: Props) {
  const tableName = params.table;
  const data = await getAdminTable(tableName, { limit: 50 });
  const rows = data.items;
  const columns = rows[0] ? Object.keys(rows[0] as AdminRow) : [];

  return (
    <main className="min-h-screen bg-background text-foreground p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">
          Admin DB — {tableName}
        </h1>
        <Link
          href="/admin/db"
          className="text-sm underline hover:no-underline"
        >
          ← Volver a tablas
        </Link>
      </div>

      <section className="border rounded-lg p-3">
        <p className="text-xs text-muted-foreground mb-2">
          Mostrando hasta {data.limit} registros.
        </p>

        {rows.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No hay filas en esta tabla.
          </p>
        )}

        {rows.length > 0 && (
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
                        {String((row as AdminRow)[col] ?? "")}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}