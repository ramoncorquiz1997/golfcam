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

// ---- URLs base del backend ----

// Detectar si estamos en el servidor (Next) o en el navegador
const isServer = typeof window === "undefined";

// Lo que ve el navegador (NEXT_PUBLIC_API_URL, viene de .env.local)
const PUBLIC_API = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

// Lo que ve SOLO el servidor de Next (INTERNAL_API_URL, también en .env.local)
const INTERNAL_API = isServer
  ? process.env.INTERNAL_API_URL?.replace(/\/$/, "") ?? "http://127.0.0.1:8000"
  : undefined;

// API que debe usar cada entorno
function getApiBaseOptional(): string | undefined {
  if (isServer) {
    return INTERNAL_API;
  }
  return PUBLIC_API;
}

function getApiBase(): string {
  const base = getApiBaseOptional();
  if (!base) {
    throw new Error(
      "API URL no configurada (NEXT_PUBLIC_API_URL / INTERNAL_API_URL)",
    );
  }
  return base;
}

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

// ---- Clubs (página pública /clubs) ----

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
  const base = getApiBaseOptional();

  // 1) Intenta API real (si está configurada)
  if (base) {
    try {
      // Ej: http://127.0.0.1:8000/api/clubs?limit=100
      return await fetchJSON<ApiList<Club>>(
        `${base}/api/clubs?${qs.toString()}`,
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

// ---- Admin (management de tablas genérico) ----

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
  const base = getApiBaseOptional();
  if (!base) {
    console.warn("getAdminTables: API no configurada");
    return [];
  }

  try {
    const res = await fetch(`${base}/api/admin/tables`, {
      cache: "no-store",
    });
    if (!res.ok) {
      console.error("getAdminTables HTTP", res.status);
      return [];
    }
    const data = (await res.json()) as AdminTablesResponse;
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
  const base = getApiBase(); // aquí sí exigimos API configurada

  const qs = toQuery(params);
  const url = `${base}/api/admin/table/${encodeURIComponent(
    name,
  )}?${qs.toString()}`;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  const data = (await res.json()) as AdminTableResponse;

  return {
    table: data.table ?? name,
    limit: data.limit ?? params.limit ?? 50,
    offset: data.offset ?? 0,
    items: data.items ?? [],
  };
}

// ---- Admin Clubs helpers (create/delete) ----

export type ClubInput = {
  slug: string;
  name: string;
  country: string;
  city?: string;
  state?: string;
  image_url?: string;
  lat?: number | null;
  lon?: number | null;
};

type AdminClubsListResponse = {
  items?: AdminRow[];
};

/** (opcional) GET /api/admin/clubs */
export async function adminListClubs(): Promise<AdminRow[]> {
  const base = getApiBase();
  const res = await fetch(`${base}/api/admin/clubs`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  const data = (await res.json()) as AdminClubsListResponse;
  return data.items ?? [];
}

/** POST /api/admin/clubs -> crea un club */
export async function adminCreateClub(
  input: ClubInput,
): Promise<AdminRow> {
  const base = getApiBase();

  const res = await fetch(`${base}/api/admin/clubs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`Error al crear club: HTTP ${res.status} ${txt}`);
  }

  const data = (await res.json()) as AdminRow;
  return data;
}

/** DELETE /api/admin/clubs/:id -> borra un club */
export async function adminDeleteClub(id: number): Promise<void> {
  const base = getApiBase();

  const res = await fetch(`${base}/api/admin/clubs/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`Error al borrar club: HTTP ${res.status} ${txt}`);
  }
}