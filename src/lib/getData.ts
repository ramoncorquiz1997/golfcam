// src/lib/getData.ts

export type Clip = {
  url: string;           // URL pública al mp4
  ts: string;            // "HH:MM:SS"
  label?: string;        // "TEE — 14:30:43"
  name?: string;
  thumb?: string;        // opcional (tu page lo usa de forma opcional)
};

/**
 * Obtiene los clips reales para un club/hoyo/fecha.
 * Llama a la API server-side que lista el filesystem del droplet.
 *
 * RUTA API (debe existir):
 *   /api/recordings/[slug]/[date]/[hole]
 *   - slug: club, p.ej. "campestre-ensenada"
 *   - date: "YYYY-MM-DD" (la API admite YYYY-MM-DD y traduce a YYYY/MM/D en FS)
 *   - hole: número (1..18) → carpeta "hole-<n>"
 */
export async function getVideosForHoleByDate(
  slug: string,
  hole: number,
  date: string
): Promise<Clip[]> {
  try {
    // pequeña validación para evitar 404 raros
    if (!slug || !date || !Number.isFinite(hole)) return [];

    const res = await fetch(`/api/recordings/${slug}/${date}/${hole}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      if (typeof window !== "undefined") {
        console.error("getVideosForHoleByDate: respuesta no OK", res.status, res.statusText);
      }
      return [];
    }

    const data = (await res.json()) as Clip[];

    // seguridad básica: asegurar shape mínimo
    return (Array.isArray(data) ? data : []).filter(
      (c) => typeof c?.url === "string" && typeof c?.ts === "string"
    );
  } catch (err) {
    if (typeof window !== "undefined") {
      console.error("getVideosForHoleByDate: error fetch", err);
    }
    return [];
  }
}