// src/lib/getData.ts

export type Clip = {
  url: string;    // URL pública al mp4 (p. ej. /recordings/<club>/hole-<n>/<YYYY>/<MM>/<D>/<HHMMSS>.mp4)
  ts: string;     // "HH:MM:SS"
  label?: string; // "TEE — 14:30:43", etc.
  name?: string;
  thumb?: string; // opcional
};

/**
 * Construye la URL del endpoint que lista clips para un club/hoyo/fecha.
 * Ejemplo: /api/recordings/campestre-ensenada/2025-10-08/16
 */
function apiUrlForHole(slug: string, date: string, hole: number): string {
  const s = encodeURIComponent(slug);
  const d = encodeURIComponent(date);
  const h = Number.isFinite(hole) ? String(hole) : "";
  return `/api/recordings/${s}/${d}/${h}`;
}

/**
 * Obtiene los clips reales para un club/hoyo/fecha.
 * Llama a la API server-side que lee el filesystem del droplet.
 *
 * - slug: club, p.ej. "campestre-ensenada"
 * - hole: número (1..18) → carpeta "hole-<n>"
 * - date: "YYYY-MM-DD" (la API traduce a YYYY/MM/D en FS)
 */
export async function getVideosForHoleByDate(
  slug: string,
  hole: number,
  date: string
): Promise<Clip[]> {
  try {
    if (!slug || !date || !Number.isFinite(hole)) return [];

    const url = apiUrlForHole(slug, date, hole);

    const res = await fetch(url, {
      // Muy importante para que **no** cachee y siempre lea del FS
      cache: "no-store",
      // Next 13/14/15 admite esta opción para forzar no revalidar
      next: { revalidate: 0 },
      headers: {
        // Cabezera inofensiva para evitar proxys intermedios cacheando
        "x-no-store": "1",
      },
    });

    if (!res.ok) {
      if (typeof window !== "undefined") {
        // eslint-disable-next-line no-console
        console.error("getVideosForHoleByDate: respuesta no OK", res.status, res.statusText);
      }
      return [];
    }

    const data = (await res.json()) as unknown;

    if (!Array.isArray(data)) return [];

    // Validación mínima de shape
    const safe: Clip[] = [];
    for (const item of data) {
      const it = item as Partial<Clip>;
      if (typeof it?.url === "string" && typeof it?.ts === "string") {
        safe.push({
          url: it.url,
          ts: it.ts,
          label: typeof it.label === "string" ? it.label : undefined,
          name: typeof it.name === "string" ? it.name : undefined,
          thumb: typeof it.thumb === "string" ? it.thumb : undefined,
        });
      }
    }

    return safe;
  } catch (err) {
    if (typeof window !== "undefined") {
      // eslint-disable-next-line no-console
      console.error("getVideosForHoleByDate: error de fetch", err);
    }
    return [];
  }
}