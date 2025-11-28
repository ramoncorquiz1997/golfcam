// src/lib/api.ts

// ---- Tipos base ----
export type Club = {
  id?: number;
  slug: string;
  name: string;
  city?: string;
  state?: string;
  country: string;
  lat?: number | null;
  lon?: number | null;
  image_url?: string | null;
  image?: string | null; // compat con JSON viejo
};

export type ApiList<T> = {
  total: number;
  limit: number;
  offset: number;
  items: T[];
};

// URL base del backend (sin slash final)
// Ej: NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
const API = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

// ---- Helpers genéricos ----

/** Fetch helper con ISR básico */
async function fetchJSON<T>(url: string): Promise<T> {
  const r = await fetch(url, { next: { revalidate: 60 } });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.json();
}

/** Convierte params (incluyendo números) a URLSearchParams */
function toQuery(params: Record<string, unknown>): URLSearchParams {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null) continue;
    const s = typeof v === "number" ? String(v) : String(v);
    if (s !== "") qs.set(k, s);
  }
  return qs;
}

// ---- Clubs ----

/** GET /api/clubs con fallback a JSON local + filtros */
export async function getClubs(
  params: {
    limit?: number;
    offset?: number;
    country?: string;
    state?: string;
    city?: string;
    q?: string;
  } = {},
): Promise<ApiList<Club>> {
  const qs = toQuery(params);

  // 1) Intenta API real
  if (API) {
    try {
      // Ej: http://127.0.0.1:8000/api/clubs?limit=100
      return await fetchJSON<ApiList<Club>>(
        `${API}/api/clubs?${qs.toString()}`,
      );
    } catch {
      // Si truena, cae al fallback local
    }
  }

  // 2) Fallback: JSON local con filtros/paginación simples
  const data = (await import("@/data/clubs.json")).default as Club[];

  const needle = (params.q ?? "").trim().toLowerCase();
  const filtered = data.filter((c) => {
    if (params.country && (c.country || "").trim() !== params.country)
      return false;
    if (params.state && (c.state || "").trim() !== params.state) return false;
    if (params.city && (c.city || "").trim() !== params.city) return false;
    if (!needle) return true;
    const haystack = [c.name, c.slug, c.city, c.state, c.country]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return haystack.includes(needle);
  });

  const limit = params.limit ?? 30;
  const offset = params.offset ?? 0;
  const items = filtered.slice(offset, offset + limit);

  return { total: filtered.length, limit, offset, items };
}

// ---- Admin (management de tablas) ----

export type AdminRow = Record<string, unknown>;

export type AdminTableResponse = {
  table: string;
  limit: number;
  offset: number;
  items: AdminRow[];
};

type AdminTablesResponse = {
  tables?: string[];
};

/** GET /api/admin/tables -> lista de tablas administrables */
export async function getAdminTables(): Promise<string[]> {
  if (!API) {
    console.warn("getAdminTables: API no configurada (NEXT_PUBLIC_API_URL)");
    return [];
  }
  try {
    const res = await fetch(`${API}/api/admin/tables`, {
      cache: "no-store",
    });
    if (!res.ok) {
      console.error("getAdminTables HTTP", res.status);
      return [];
    }
    const data = (await res.json()) as AdminTablesResponse;
    console.log("ADMIN TABLES RAW", data);
    return data.tables ?? [];
  } catch (err) {
    console.error("getAdminTables error", err);
    return [];
  }
}

/** GET /api/admin/table/:name -> filas de una tabla (solo lectura) */
export async function getAdminTable(
  name: string,
  params: { limit?: number; offset?: number } = {},
): Promise<AdminTableResponse> {
  if (!API) {
    throw new Error(
      "API URL not configured (NEXT_PUBLIC_API_URL no está seteada)",
    );
  }

  const qs = toQuery(params);
  const url = `${API}/api/admin/table/${encodeURIComponent(
    name,
  )}?${qs.toString()}`;

  console.log("getAdminTable URL", url);

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  const data = (await res.json()) as AdminTableResponse;
  console.log("ADMIN TABLE RAW DATA", data);

  return {
    table: data.table,
    limit: data.limit,
    offset: data.offset,
    items: data.items ?? [],
  };
}
