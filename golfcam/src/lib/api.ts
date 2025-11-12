// src/lib/api.ts
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

export type ApiList<T> = { total: number; limit: number; offset: number; items: T[] };

const API = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

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

/** GET /api/clubs con fallback a JSON local + filtros */
export async function getClubs(params: {
  limit?: number;
  offset?: number;
  country?: string;
  state?: string;
  city?: string;
  q?: string;
} = {}): Promise<ApiList<Club>> {
  const qs = toQuery(params);

  // 1) Intenta API real
  if (API) {
    try {
      return await fetchJSON<ApiList<Club>>(`${API}/api/clubs?${qs.toString()}`);
    } catch {
      // cae al fallback
    }
  }

  // 2) Fallback: JSON local con filtros/paginación simples
  const data = (await import("@/data/clubs.json")).default as Club[];

  const needle = (params.q ?? "").trim().toLowerCase();
  const filtered = data.filter((c) => {
    if (params.country && (c.country || "").trim() !== params.country) return false;
    if (params.state && (c.state || "").trim() !== params.state) return false;
    if (params.city && (c.city || "").trim() !== params.city) return false;
    if (!needle) return true;
    const haystack = [
      c.name,
      c.slug,
      c.city,
      c.state,
      c.country,
    ]
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