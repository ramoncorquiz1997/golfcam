// src/lib/api.ts

export type Hole = {
  slug: string;
  name: string;
  image?: string | null;
  image_url?: string | null;
  number?: number | null;
  par?: number | null;
  yardage?: number | null;
};

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
  image?: string | null;
  holes?: Hole[];
  courts?: Hole[];
};

export type ApiList<T> = {
  total: number;
  limit: number;
  offset: number;
  items: T[];
};

const API = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

function apiUrl(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  const cleanPath = path.startsWith("/") ? path : `/${path}`;

  if (!API) {
    return cleanPath;
  }

  return `${API}${cleanPath}`;
}

async function fetchJSON<T>(url: string): Promise<T> {
  const r = await fetch(url, { next: { revalidate: 60 } });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.json() as Promise<T>;
}

function toQuery(params: Record<string, unknown>): URLSearchParams {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null) continue;
    const s = typeof v === "number" ? String(v) : String(v);
    if (s !== "") qs.set(k, s);
  }
  return qs;
}

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

  if (API) {
    try {
      return await fetchJSON<ApiList<Club>>(`${API}/api/clubs?${qs.toString()}`);
    } catch {}
  }

  const data = (await import("@/data/clubs.json")).default as Club[];

  const needle = (params.q ?? "").trim().toLowerCase();
  const filtered = data.filter((c) => {
    if (params.country && (c.country || "").trim() !== params.country) return false;
    if (params.state && (c.state || "").trim() !== params.state) return false;
    if (params.city && (c.city || "").trim() !== params.city) return false;
    if (!needle) return true;

    const units = c.holes ?? c.courts ?? [];
    const haystack = [
      c.name,
      c.slug,
      c.city,
      c.state,
      c.country,
      ...units.map((u) => `${u.name} ${u.slug}`),
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

export async function getAdminTables(): Promise<string[]> {
  const url = apiUrl("/api/admin/tables");

  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return [];
    const data = (await res.json()) as AdminTablesResponse;
    return data.tables ?? [];
  } catch {
    return [];
  }
}

export async function getAdminTable(
  name: string,
  params: { limit?: number; offset?: number } = {},
): Promise<AdminTableResponse> {
  const qs = toQuery(params);
  const path = `/api/admin/table/${encodeURIComponent(name)}?${qs.toString()}`;
  const url = apiUrl(path);

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  const data = (await res.json()) as AdminTableResponse;

  return {
    table: data.table,
    limit: data.limit,
    offset: data.offset,
    items: data.items ?? [],
  };
}

export type AdminCreateClubPayload = {
  name: string;
  country: string;
  city?: string;
  state?: string;
  lat?: number | null;
  lon?: number | null;
  imageFile?: File | null;
};

export async function adminCreateClub(
  payload: AdminCreateClubPayload,
): Promise<Club> {
  const form = new FormData();
  form.set("name", payload.name);
  form.set("country", payload.country);

  if (payload.city) form.set("city", payload.city);
  if (payload.state) form.set("state", payload.state);
  if (payload.lat !== undefined && payload.lat !== null) form.set("lat", String(payload.lat));
  if (payload.lon !== undefined && payload.lon !== null) form.set("lon", String(payload.lon));
  if (payload.imageFile) form.set("image", payload.imageFile);

  const res = await fetch("/api/admin/clubs", {
    method: "POST",
    body: form,
  });

  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  return res.json() as Promise<Club>;
}

export async function adminDeleteClub(id: number): Promise<void> {
  const res = await fetch(`/api/admin/clubs/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error(`HTTP ${res.status}`);
}
